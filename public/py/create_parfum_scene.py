"""
Blender Python script — ParfumScene (faithful to the React Three Fiber scene)
==============================================================================
This script rebuilds, **inside Blender**, the exact scene described by the
React component  `src/composants/design/ParfumScene.jsx` :

  — a perfume bottle:  rounded glass body, liquid fill, golden collar + stem,
    golden cap, front & back labels;
  — the same materials (colours, roughness, metalness, transparencies);
  -  the same continuous Y‑rotation (0.5 rad/s); and
  — the same periodic "Dissolve & Re‑form" cycle, implemented with a
    Geometry‑Nodes modifier (Scene‑Time driven), replicating the JSX shader:

        time phase `p = t mod PERIOD`,  with
          COHESIVE = 2π/ROTATION_SPEED ≈ 12.566 s   (s = 0)
          DISSOLVE = 3 s                             (s: 0 → 1)
          ASH      = 4 s                             (s = 1)
          REFORM   = 3 s                             (s: 1 → 0)
          PERIOD   = COHESIVE + DISSOLVE + ASH + REFORM ≈ 22.566 s

        dissolve mask = dissolveY * 0.55 + noise * 0.45
          with dissolveY = clamp((worldY - MIN_Y) / (MAX_Y - MIN_Y), 0, 1)
          MIN_Y = -1.3, MAX_Y = 1.7
        a face is removed while  mask < s.

It does **NOT** export any JSX — it is the Blender‑only twin of the Web scene.

Run inside Blender (≥ 3.6, tested on 3.6 & 4.2):
    blender --background --python create_parfum_scene.py
or open Blender → Scripting → Load this file → Run Script.
"""

from __future__ import annotations

import bpy
import math
import random

# ══════════════════════════════════════════════════════════════════════
#  PARAMETERS — copied straight from src/composants/design/ParfumScene.jsx
# ══════════════════════════════════════════════════════════════════════
ROTATION_SPEED = 0.5                      # rad / s
TURN_TIME = (2 * math.pi) / ROTATION_SPEED
COHESIVE_TIME = TURN_TIME                 # ≈ 12.566 s
DISSOLVE_TIME = 3.0
ASH_TIME = 4.0
REFORM_TIME = 3.0
PERIOD = COHESIVE_TIME + DISSOLVE_TIME + ASH_TIME + REFORM_TIME

MIN_Y = -1.3
MAX_Y = 1.7

GLASS_RGB = (0.749, 0.890, 1.0, 1.0)      # #bfe3ff
LIQUID_RGB = (0.957, 0.761, 0.761, 1.0)   # #f4c2c2
METAL_RGB = (0.910, 0.784, 0.420, 1.0)    # #e8c86b
GOLD_RGB = (0.831, 0.686, 0.216, 1.0)     # #d4af37
GREY_RGB = (0.55, 0.53, 0.5, 1.0)         # ash particle colour

GROUP_OFFSET_Y = -0.35                    # JSX: <group position={[0, -0.35, 0]}>
FPS = 30

# ══════════════════════════════════════════════════════════════════════
#  UTILITIES
# ══════════════════════════════════════════════════════════════════════
def _clean_scene():
    scn = bpy.context.scene
    for obj in list(scn.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    master = scn.collection
    for coll in list(bpy.data.collections):
        if coll != master:
            bpy.data.collections.remove(coll)
    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)
    for img in list(bpy.data.images):
        bpy.data.images.remove(img)


def _new_collection(name: str, parent=None):
    c = bpy.data.collections.new(name)
    (parent or bpy.context.scene.collection).children.link(c)
    return c


def _link(obj, collection):
    for c in obj.users_collection:
        c.objects.unlink(obj)
    collection.objects.link(obj)


def _ensure_material(name, base_color, roughness=0.4, metallic=0.0, alpha=1.0,
                     blend="OPAQUE", emission=None, emission_strength=0.0):
    mat = bpy.data.materials.get(name)
    if mat is None:
        mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf is None:
        bsdf = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = base_color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Alpha"].default_value = alpha
    if emission is not None:
        bsdf.inputs["Emission Color"].default_value = emission
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    if hasattr(mat, "blend_method"):
        mat.blend_method = blend
    if hasattr(mat, "shadow_method"):
        mat.shadow_method = "HASHED" if blend != "OPAQUE" else "OPAQUE"
    return mat


def _set_smooth(obj, angle=30.0):
    for poly in obj.data.polygons:
        poly.use_smooth = True
    if hasattr(obj.data, "use_auto_smooth"):
        obj.data.use_auto_smooth = True
        obj.data.auto_smooth_angle = math.radians(angle)


def _rounded_box(name, size, radius=0.1, segments=8, collection=None):
    """Beveled cube — equivalent of drei's <RoundedBox args={size} radius smoothness>."""
    bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    bevel = obj.modifiers.new("Bevel", "BEVEL")
    bevel.width = radius
    bevel.segments = segments
    bevel.affect = "EDGES"
    bevel.limit_method = "ANGLE"
    bevel.angle_limit = math.radians(60)
    bevel.miter_outer = "MITER_ARC" if hasattr(bevel, "miter_outer") else "MITER"
    _set_smooth(obj)
    if collection:
        _link(obj, collection)
    return obj


def _cylinder(name, radius_top=0.5, radius_bottom=0.5, depth=1.0, segments=32,
              collection=None):
    """Cylinder aligned along Y (like three.js), with optional taper."""
    import bmesh
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius_bottom, depth=depth, vertices=segments, location=(0, 0, 0)
    )
    obj = bpy.context.active_object
    obj.name = name
    # scale the top ring toward the axis to create the taper
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    top_z = max(v.co.z for v in bm.verts)
    ratio = radius_top / radius_bottom if radius_bottom else 1.0
    for v in bm.verts:
        if abs(v.co.z - top_z) < 1e-4:
            v.co.x *= ratio
            v.co.y *= ratio
    bm.to_mesh(obj.data)
    bm.free()
    obj.rotation_euler.x = math.radians(-90)      # three.js cylinders run along Y
    bpy.ops.object.transform_apply(rotation=True)
    _set_smooth(obj)
    if collection:
        _link(obj, collection)
    return obj


def _plane(name, size=(1, 1), collection=None):
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0], size[1], 1)      # primitive_plane_add(size=1) → 1×1 plane
    bpy.ops.object.transform_apply(scale=True)
    if collection:
        _link(obj, collection)
    return obj


def _empty(name, collection=None):
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    e = bpy.context.active_object
    e.name = name
    if collection:
        _link(e, collection)
    return e

# ══════════════════════════════════════════════════════════════════════
#  LABEL TEXTURES — procedural 420×580 labels (gold frame, retro/luxe)
# ══════════════════════════════════════════════════════════════════════
def _label_image(name, width=420, height=580, verso=False):
    img = bpy.data.images.new(name, width=width, height=height, alpha=True)
    px = [0.0] * (width * height * 4)

    def set_p(x, y, r, g, b, a=1.0):
        i = (y * width + x) * 4
        px[i], px[i + 1], px[i + 2], px[i + 3] = r, g, b, a

    bg = (0.08, 0.06, 0.12)
    gold = (0.91, 0.78, 0.42)
    ink = (0.62, 0.50, 0.28)

    for y in range(height):
        for x in range(width):
            set_p(x, y, *bg)

    # golden frame (outer + inner)
    bw = 10
    for i in range(bw):
        for x in range(width):
            set_p(x, i, *gold)
            set_p(x, height - 1 - i, *gold)
        for y in range(height):
            set_p(i, y, *gold)
            set_p(width - 1 - i, y, *gold)
    for i in range(4):
        o = 34 + i
        w, h = width - 2 * o, height - 2 * o
        for x in range(o, o + w):
            set_p(x, o, *tuple(c * 0.75 for c in gold))
            set_p(x, o + h - 1, *tuple(c * 0.75 for c in gold))
        for y in range(o, o + h):
            set_p(o, y, *tuple(c * 0.75 for c in gold))
            set_p(o + w - 1, y, *tuple(c * 0.75 for c in gold))

    cx, cy = width // 2, height // 2 - 28
    # central diamond flourish
    for dy in range(-42, 43):
        for dx in range(-42, 43):
            m = abs(dx) + abs(dy)
            if 36 < m < 42:
                set_p(cx + dx, cy + dy, *gold)
    # corner L-flourishes
    for cx0, cy0, sx, sy in [
        (44, 44, 1, 1), (width - 44, 44, -1, 1),
        (44, height - 44, 1, -1), (width - 44, height - 44, -1, -1),
    ]:
        for i in range(22):
            set_p(cx0 + sx * i, cy0, *gold)
            set_p(cx0, cy0 + sy * i, *gold)

    # text lines
    if verso:
        y0 = height // 2 + 20
        for j in range(12):
            wn = 96 - j * 5
            yy = y0 + j * 9
            for x in range(cx - wn, cx + wn):
                set_p(x, yy, *ink)
    else:
        for yy, wn in [(height // 2 + 18, 96), (height // 2 + 27, 64),
                       (height // 2 + 55, 60), (height // 2 + 64, 40)]:
            for x in range(cx - wn, cx + wn):
                set_p(x, yy, *gold if wn > 60 else ink)
    # brand band
    for x in range(cx - 112, cx + 112):
        for dy in range(4):
            set_p(x, height // 2 - 112 + dy, *gold)

    img.pixels[:] = px
    img.pack()
    return img


def _label_material(name, image, blend="CLIP"):
    mat = _ensure_material(name, (1, 0, 1, 1), roughness=0.85, metallic=0.0,
                           alpha=1.0, blend=blend)
    nt = mat.node_tree
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = image
    if hasattr(tex, "interpolation"):
        tex.interpolation = "Linear"
    if hasattr(tex, "color_space"):
        tex.color_space = "COLOR"
    bsdf = nt.nodes.get("Principled BSDF")
    nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    nt.links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    return mat

# ══════════════════════════════════════════════════════════════════════
#  GEOMETRY NODES — Dissolve modifier replicating the JSX shader
# ══════════════════════════════════════════════════════════════════════
def _ng_socket(ng, name, socket_type, in_out="INPUT"):
    if hasattr(ng, "interface"):
        return ng.interface.new_socket(name=name, in_out=in_out, socket_type=socket_type)
    if in_out == "INPUT":
        return ng.inputs.new(socket_type, name)
    return ng.outputs.new(socket_type, name)


def _create_dissolve_node_group():
    """
    Geometry Nodes driven purely by Scene Time, replicating phaseParams()
    and the JSX dissolve shader:

        period  = COHESIVE + DISSOLVE + ASH + REFORM
        p       = mod(seconds, period)
        s       = clamp((p − COHESIVE)/DISSOLVE, 0, 1)
                − clamp((p − (COHESIVE+DISSOLVE+ASH))/REFORM, 0, 1)

        dissolveY = clamp((posY − MIN_Y) / (MAX_Y − MIN_Y), 0, 1)
        mask      = dissolveY * HeightWeight + noise * NoiseWeight
        delete a face when  mask < s
    """
    ng = bpy.data.node_groups.new("DissolveEffect", "GeometryNodeTree")

    # ── inputs ──
    _ng_socket(ng, "Geometry", "NodeSocketGeometry", "INPUT")
    inp = _ng_socket(ng, "CohesiveTime", "NodeSocketFloat", "INPUT")
    inp.default_value = COHESIVE_TIME
    inp = _ng_socket(ng, "DissolveTime", "NodeSocketFloat", "INPUT")
    inp.default_value = DISSOLVE_TIME
    inp = _ng_socket(ng, "AshTime", "NodeSocketFloat", "INPUT")
    inp.default_value = ASH_TIME
    inp = _ng_socket(ng, "ReformTime", "NodeSocketFloat", "INPUT")
    inp.default_value = REFORM_TIME
    inp = _ng_socket(ng, "MinY", "NodeSocketFloat", "INPUT")
    inp.default_value = MIN_Y
    inp = _ng_socket(ng, "MaxY", "NodeSocketFloat", "INPUT")
    inp.default_value = MAX_Y
    inp = _ng_socket(ng, "HeightWeight", "NodeSocketFloat", "INPUT")
    inp.default_value = 0.55
    inp = _ng_socket(ng, "NoiseWeight", "NodeSocketFloat", "INPUT")
    inp.default_value = 0.45
    inp = _ng_socket(ng, "NoiseScale", "NodeSocketFloat", "INPUT")
    inp.default_value = 8.0
    inp = _ng_socket(ng, "AshDrift", "NodeSocketFloat", "INPUT")
    inp.default_value = 0.08

    _ng_socket(ng, "Geometry", "NodeSocketGeometry", "OUTPUT")

    nodes = ng.nodes
    links = ng.links
    L = links.new
    gi = nodes.new("NodeGroupInput")
    gi.location = (-3000, 0)
    go = nodes.new("NodeGroupOutput")
    go.location = (1400, 0)

    def math_(op, loc, uc=False):
        n = nodes.new("ShaderNodeMath")
        n.operation = op
        n.use_clamp = uc
        n.location = loc
        return n

    # ────────── temporal cycle: s(t) ──────────
    st = nodes.new("GeometryNodeInputSceneTime")
    st.location = (-2800, 900)

    # period = Cohesive + Dissolve + Ash + Reform
    p_cd = math_("ADD", (-2600, 700))
    L(gi.outputs["CohesiveTime"], p_cd.inputs[0])
    L(gi.outputs["DissolveTime"], p_cd.inputs[1])
    p_cda = math_("ADD", (-2600, 560))
    L(p_cd.outputs["Value"], p_cda.inputs[0])
    L(gi.outputs["AshTime"], p_cda.inputs[1])
    period = math_("ADD", (-2600, 420))
    L(p_cda.outputs["Value"], period.inputs[0])
    L(gi.outputs["ReformTime"], period.inputs[1])

    mod = math_("MODULO", (-2400, 900))      # p = seconds mod period
    L(st.outputs["Seconds"], mod.inputs[0])
    L(period.outputs["Value"], mod.inputs[1])

    # ramp1 = clamp((p − Cohesive)/Dissolve, 0, 1)
    r1_sub = math_("SUBTRACT", (-2200, 700))
    L(mod.outputs["Value"], r1_sub.inputs[0])
    L(gi.outputs["CohesiveTime"], r1_sub.inputs[1])
    r1_div = math_("DIVIDE", (-2000, 700))
    L(r1_sub.outputs["Value"], r1_div.inputs[0])
    L(gi.outputs["DissolveTime"], r1_div.inputs[1])
    r1 = nodes.new("ShaderNodeClamp")
    r1.location = (-1800, 700)
    L(r1_div.outputs["Value"], r1.inputs["Value"])

    # ramp2 = clamp((p − (Cohesive+Dissolve+Ash))/Reform, 0, 1)
    r2_sub = math_("SUBTRACT", (-2200, 520))
    L(mod.outputs["Value"], r2_sub.inputs[0])
    L(p_cda.outputs["Value"], r2_sub.inputs[1])
    r2_div = math_("DIVIDE", (-2000, 520))
    L(r2_sub.outputs["Value"], r2_div.inputs[0])
    L(gi.outputs["ReformTime"], r2_div.inputs[1])
    r2 = nodes.new("ShaderNodeClamp")
    r2.location = (-1800, 520)
    L(r2_div.outputs["Value"], r2.inputs["Value"])

    s = math_("SUBTRACT", (-1600, 620), uc=True)   # s = r1 − r2, clamped
    s.label = "dissolve s"
    L(r1.outputs["Result"], s.inputs[0])
    L(r2.outputs["Result"], s.inputs[1])

    # ────────── dissolve mask ──────────
    pos = nodes.new("GeometryNodeInputPosition")
    pos.location = (-2400, -300)
    sep = nodes.new("ShaderNodeSeparateXYZ")
    sep.location = (-2400, -500)
    L(pos.outputs["Position"], sep.inputs["Vector"])

    # height factor (world Y is local Y here: parts are placed at world Y)
    map_y = nodes.new("ShaderNodeMapRange")
    map_y.location = (-2200, -500)
    L(sep.outputs["Y"], map_y.inputs["Value"])
    L(gi.outputs["MinY"], map_y.inputs["From Min"])
    L(gi.outputs["MaxY"], map_y.inputs["From Max"])
    map_y.inputs["To Min"].default_value = 0.0
    map_y.inputs["To Max"].default_value = 1.0
    diss_y = nodes.new("ShaderNodeClamp")
    diss_y.location = (-2000, -500)
    L(map_y.outputs["Result"], diss_y.inputs["Value"])

    # procedural noise (Perlin)
    noise = nodes.new("ShaderNodeTexNoise")
    noise.location = (-2200, -900)
    L(pos.outputs["Position"], noise.inputs["Vector"])
    L(gi.outputs["NoiseScale"], noise.inputs["Scale"])

    mul_h = math_("MULTIPLY", (-2000, -700))
    L(gi.outputs["HeightWeight"], mul_h.inputs[0])
    L(diss_y.outputs["Result"], mul_h.inputs[1])
    mul_n = math_("MULTIPLY", (-2000, -850))
    L(gi.outputs["NoiseWeight"], mul_n.inputs[0])
    L(noise.outputs["Fac"], mul_n.inputs[1])
    mask = math_("ADD", (-1800, -700))
    L(mul_h.outputs["Value"], mask.inputs[0])
    L(mul_n.outputs["Value"], mask.inputs[1])

    # delete where mask < s
    cmp = nodes.new("FunctionNodeCompare")
    cmp.data_type = "FLOAT"
    cmp.operation = "LESS_THAN"
    cmp.location = (-1400, -700)
    L(mask.outputs["Value"], cmp.inputs[0])
    L(s.outputs["Value"], cmp.inputs[1])

    delete = nodes.new("GeometryNodeDeleteGeometry")
    delete.location = (-800, 0)
    L(gi.outputs["Geometry"], delete.inputs["Geometry"])
    L(cmp.outputs["Result"], delete.inputs["Selection"])

    # ────────── ash drift on the dissolve edge ──────────
    edge = math_("SUBTRACT", (-1400, -1100))
    L(mask.outputs["Value"], edge.inputs[0])
    L(s.outputs["Value"], edge.inputs[1])
    edge_s = math_("MULTIPLY", (-1200, -1100))
    L(s.outputs["Value"], edge_s.inputs[0])
    L(edge.outputs["Value"], edge_s.inputs[1])
    drift = math_("MULTIPLY", (-1000, -1100))
    L(gi.outputs["AshDrift"], drift.inputs[0])
    L(edge_s.outputs["Value"], drift.inputs[1])
    comb = nodes.new("ShaderNodeCombineXYZ")
    comb.location = (-800, -1100)
    L(drift.outputs["Value"], comb.inputs["Y"])

    set_pos = nodes.new("GeometryNodeSetPosition")
    set_pos.location = (-400, 0)
    L(delete.outputs["Geometry"], set_pos.inputs["Geometry"])
    L(comb.outputs["Vector"], set_pos.inputs["Offset"])

    L(set_pos.outputs["Geometry"], go.inputs["Geometry"])
    return ng

# ══════════════════════════════════════════════════════════════════════
#  ASH PARTICLES
# ══════════════════════════════════════════════════════════════════════
def _add_ash_particles(emitter, mat_ash):
    """Grey ash/dust emitted from the bottle while it dissolves/disperses."""
    bpy.context.view_layer.objects.active = emitter
    emitter.select_set(True)
    # ash material must live in the emitter's slots (st.material is a slot index)
    slot_idx = len(emitter.data.materials)
    emitter.data.materials.append(mat_ash)
    bpy.ops.object.particle_system_add()
    ps = emitter.particle_systems[-1]
    st = ps.settings
    st.frame_start = int(COHESIVE_TIME * FPS)            # dissolve begins
    st.frame_end = int(PERIOD * FPS)                     # full cycle
    st.lifetime = int((ASH_TIME + REFORM_TIME) * FPS)    # ~ 210 frames
    st.count = 3500
    st.emit_from = "FACE"
    st.distribution = "RAND" if hasattr(st, "distribution") else None
    st.physics_type = "NEWTON"
    st.normal_factor = 0.0
    st.tangent_factor = 0.0
    st.object_align_factor = (0.0, 0.6, 0.4)
    st.brownian_factor = 0.35
    st.drag_factor = 0.02
    st.particle_size = 0.05
    st.size_random = 0.01
    st.render_type = "HALO"
    st.display_size = 0.015
    st.material = slot_idx
    # face normal random — emit from whole surface with slight outward push
    return ps

# ══════════════════════════════════════════════════════════════════════
#  BUILD THE SCENE
# ══════════════════════════════════════════════════════════════════════
def build_scene():
    _clean_scene()
    scn = bpy.context.scene
    scn.frame_start = 1
    scn.frame_end = int(PERIOD * FPS)                      # ≈ 677
    scn.render.fps = FPS

    bottle_coll = _new_collection("Bottle")
    fx_coll = _new_collection("FX")

    # ── Materials ─────────────────────────────────────────────────
    mat_glass = _ensure_material(
        "Glass_Body", GLASS_RGB, roughness=0.08, metallic=0.15,
        alpha=0.3, blend="BLEND")
    # Note: JSX uses side: THREE.DoubleSide — Blender materials are
    # double‑sided by default.

    mat_liquid = _ensure_material(
        "Liquid_Fill", LIQUID_RGB, roughness=0.15, metallic=0.05,
        alpha=0.85, blend="BLEND")

    mat_metal = _ensure_material(
        "Gold_Collar_Stem", METAL_RGB, roughness=0.2, metallic=0.9)

    mat_cap = _ensure_material(
        "Gold_Rich_Cap", GOLD_RGB, roughness=0.25, metallic=0.85)

    mat_ash = _ensure_material(
        "Ash_Particle", GREY_RGB, roughness=1.0, metallic=0.0,
        alpha=0.85, blend="HASHED")

    # ── Geometry (all centered on X/Z, placed at their JS world Y) ─
    glass = _rounded_box("Glass_Bottle", (1.4, 1.9, 0.72), radius=0.16,
                         segments=8, collection=bottle_coll)
    glass.location.y = -0.05 + GROUP_OFFSET_Y              # JS: position [0, -0.05, 0]
    glass.data.materials.append(mat_glass)

    liquid = _rounded_box("Liquid_Fill", (1.12, 1.45, 0.5), radius=0.12,
                          segments=8, collection=bottle_coll)
    liquid.location.y = -0.22 + GROUP_OFFSET_Y             # JS: [0, -0.22, 0]
    liquid.data.materials.append(mat_liquid)

    collar = _cylinder("Collar", radius_top=0.34, radius_bottom=0.38,
                       depth=0.14, segments=32, collection=bottle_coll)
    collar.location.y = 0.95 + GROUP_OFFSET_Y              # JS: [0, 0.95, 0]
    collar.data.materials.append(mat_metal)

    stem = _cylinder("Stem", radius_top=0.13, radius_bottom=0.16,
                     depth=0.22, segments=32, collection=bottle_coll)
    stem.location.y = 1.12 + GROUP_OFFSET_Y                # JS: [0, 1.12, 0]
    stem.data.materials.append(mat_metal)

    # cap = PLAIN box (the JSX uses <boxGeometry>, not rounded)
    bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
    cap = bpy.context.active_object
    cap.name = "Cap"
    cap.scale = (0.48 / 2, 0.42 / 2, 0.26 / 2)
    bpy.ops.object.transform_apply(scale=True)
    cap.location.y = 1.42 + GROUP_OFFSET_Y                 # JS: [0, 1.42, 0]
    cap.data.materials.append(mat_cap)
    _link(cap, bottle_coll)

    # ── Labels ────────────────────────────────────────────────────
    lab_front_img = _label_image("Label_Front", verso=False)
    lab_front_mat = _label_material("LabelMat_Front", lab_front_img, blend="CLIP")

    lab_front = _plane("Label_Front", size=(0.98, 1.35), collection=bottle_coll)
    lab_front.location = (0, -0.05 + GROUP_OFFSET_Y, 0.37)  # JS: [0, -0.05, 0.37]
    lab_front.data.materials.append(lab_front_mat)

    lab_back_img = _label_image("Label_Back", verso=True)
    lab_back_mat = _label_material("LabelMat_Back", lab_back_img, blend="CLIP")

    lab_back = _plane("Label_Back", size=(0.98, 1.35), collection=bottle_coll)
    lab_back.location = (0, -0.05 + GROUP_OFFSET_Y, -0.37)  # JS: [0, -0.05, -0.37]
    lab_back.rotation_euler = (0, math.radians(180), 0)     # JS: rotation [0, π, 0]
    lab_back.data.materials.append(lab_back_mat)

    # ── Parent to a rotating pivot ────────────────────────────────
    pivot = _empty("Bottle_Pivot", collection=bottle_coll)
    for obj in (glass, liquid, collar, stem, cap, lab_front, lab_back):
        obj.parent = pivot

    # rotation.y = t * 0.5  (ROTATION_SPEED), continuous & linear
    pivot.rotation_euler.y = 0.0
    pivot.keyframe_insert(data_path="rotation_euler", frame=1)
    pivot.rotation_euler.y = (PERIOD * FPS / FPS) * ROTATION_SPEED
    pivot.keyframe_insert(data_path="rotation_euler", frame=int(PERIOD * FPS))
    if pivot.animation_data and pivot.animation_data.action:
        for fc in pivot.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"

    # ── Dissolve Geometry‑Nodes modifier on every visible part ────
    dissolve_ng = _create_dissolve_node_group()
    for obj in (glass, liquid, collar, stem, cap, lab_front, lab_back):
        mod = obj.modifiers.new("Dissolve", "NODES")
        mod.node_group = dissolve_ng

    # ── Ash particles (grey cloud) ────────────────────────────────
    _add_ash_particles(glass, mat_ash)

    # ── Lighting — faithful to the JSX lights ─────────────────────
    bpy.ops.object.light_add(type="SUN", location=(5, 6, 4),
                             rotation=_aim_at_origin((5, 6, 4)))
    key = bpy.context.active_object
    key.name = "Key_Sun"
    key.data.energy = 2.0

    bpy.ops.object.light_add(type="SUN", location=(-4, -3, -2),
                             rotation=_aim_at_origin((-4, -3, -2)))
    fill = bpy.context.active_object
    fill.name = "Fill_Sun"
    fill.data.energy = 0.7
    fill.data.color = (0.647, 0.839, 1.0)                  # #a5d6ff

    bpy.ops.object.light_add(type="POINT", location=(0, 2.5, 3))
    rim = bpy.context.active_object
    rim.name = "Rim_Point"
    rim.data.energy = 120
    rim.data.color = (1.0, 1.0, 1.0)

    bpy.ops.object.light_add(type="POINT", location=(0, 0, 0))   # ambient stand‑in
    amb = bpy.context.active_object
    amb.name = "Ambient_Point"
    amb.data.energy = 20

    # ── Camera ────────────────────────────────────────────────────
    bpy.ops.object.camera_add(location=(3.5, 2.5, 2.5))
    cam = bpy.context.active_object
    cam.name = "Main_Camera"
    cam.data.lens = 50
    scn.camera = cam
    _aim_at(cam, (0, 0, 0))

    # ── World (dark studio backdrop) ──────────────────────────────
    world = scn.world or bpy.data.worlds.new("World")
    scn.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs["Color"].default_value = (0.02, 0.02, 0.03, 1)
        bg.inputs["Strength"].default_value = 0.6

    scn.frame_set(1)
    print("✅  ParfumScene built — faithful to src/composants/design/ParfumScene.jsx")


def _aim_at_origin(loc):
    """Euler that makes an object's -Z axis point toward the origin."""
    from mathutils import Vector
    d = -Vector(loc).normalized()
    return d.to_track_quat("-Z", "Y").to_euler()


def _aim_at(obj, target):
    from mathutils import Vector
    d = Vector(target) - Vector(obj.location)
    obj.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


if __name__ == "__main__":
    build_scene()