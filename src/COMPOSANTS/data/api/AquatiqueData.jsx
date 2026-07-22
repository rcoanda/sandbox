import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import useTextureLoader from './TextureLoader'

const COUNT = 30

function createFallbackTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0a1628'
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

const ENTRIES = [
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aeZB88BOoF08xJFQ_OceanImageBank_OlivierBlaud_StudioPONANT_07_COVER.jpg?auto=format,compress',
    title: 'Antarctica polar seascape',
    artist: 'Olivier Blaud, Studio Ponant / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aShFDnNYClf9nij4_OceanImageBank_EmilieLedwidge_34.jpg?auto=format,compress',
    title: 'Marine animal portrait',
    artist: 'Emilie Ledwidge / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/24237bbf-f182-4619-af22-2cbb732ab1f4_Merr+Watson+for+Toolkits.jpg?auto=format,compress',
    title: 'Coastal landscape and islands',
    artist: 'Merr Watson / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/Z-1EzndAxsiBwOtz_PeopleOceanImageBank_GrantThomas_18.jpg?auto=format,compress',
    title: 'People connecting with the ocean',
    artist: 'Grant Thomas / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aAJhkevxEdbNPOi9_OceanImageBank_RenataRomeo_41.jpg?auto=format,compress',
    title: 'Coral reef ecosystem',
    artist: 'Renata Romeo / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/ccde5848-526d-4e2d-9c1c-10d8a3221484_Cover_Mangroves_MattCurnock.jpg?auto=compress,format',
    title: 'Mangrove forest shoreline',
    artist: 'Matt Curnock / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/Z-1FRXdAxsiBwOuY_360OceanImageBank_TheOceanAgency_360_33.jpg?auto=format,compress',
    title: '360° panoramic ocean view',
    artist: 'The Ocean Agency / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/98bb9ab2-9a04-459c-92bc-234fc7a04ae2_Cover_Temperate_StefanAndrews.jpg?auto=compress,format',
    title: 'Kelp forest underwater',
    artist: 'Stefan Andrews / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/5aac3744-16b3-4773-ba02-b2376840dc42_Cover_Bleaching_TOA.jpg?auto=compress,format',
    title: 'Coral bleaching event',
    artist: 'Richard Vevers / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aFQSK3fc4bHWiioR_CoverMasayukiAgawa_17.jpg?auto=format,compress',
    title: 'Shark in open water',
    artist: 'Masayuki Agawa / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/0562b596-9927-4a69-9b01-58b10931503e_Cover_Macro_RamonaOsche.jpg?auto=compress,format',
    title: 'Macro marine life detail',
    artist: 'Ramona Osche / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/f95d08b1-573e-49d4-860d-2abd66562fa5_OceanImageBank_NajaBertoltJensen_24.jpg?auto=compress,format',
    title: 'Ocean plastic pollution',
    artist: 'Naja Bertolt Jensen / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/5d53515b-8c4d-4be1-a1c6-bc74f7fb8e83_seagrass+category.jpg?auto=compress,format',
    title: 'Seagrass meadow',
    artist: 'Michiel Vos / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/e1af6c5e-2aec-475f-b2dc-a7dd1f199a22_Cover_Blackwater_MikeBartick.jpg?auto=compress,format',
    title: 'Blackwater pelagic marine life',
    artist: 'Mike Bartick / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aShF3XNYClf9nilT_OceanImageBank_ThomasHorig_12.jpg?auto=format,compress',
    title: 'Waves and open water',
    artist: 'Thomas Horig / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aeaCq8BOoF08xJhj_OceanImageBank_MattHorspool_23_COVER.jpg?auto=format,compress',
    title: 'Arctic polar landscape',
    artist: 'Matt Horspool / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aRXUmrpReVYa4bjH_OceanImageBank_LarsvonRitterZahony_12_OceanImageBankcover.jpg?auto=format,compress',
    title: 'Humpback whale Antarctic Peninsula',
    artist: 'Lars von Ritter Zahony / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aQR787pReVYa33q9_img-bank.jpg?auto=format,compress',
    title: 'Ocean Image Bank collection',
    artist: 'Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/e624099f-29bd-4624-80f6-04bd690a9960_OceanImageBank_MattCurnock_125.jpg?auto=compress,format',
    title: 'Environmental science — marine ecosystem',
    artist: 'Matt Curnock / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/519311d6-b050-4f4d-8805-5f066976bfd9_OceanImageBank_KimberlyJeffries_30+copy.jpg?auto=compress,format',
    title: 'Grade 8 — ocean exploration',
    artist: 'Kimberly Jeffries / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/854e0c10-94ff-45a8-9345-ecbae20be063_0P6A7135.jpg?auto=compress,format',
    title: 'Anatomy and physiology of marine life',
    artist: 'Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/e8196df9-2391-4283-8a89-8e6ae95a5ba9_OceanImageBank_GregoryPiper_09.jpg?auto=compress,format',
    title: 'Grade 7 — ocean phenomena',
    artist: 'Gregory Piper / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/1a6812d5-21e5-488b-9747-ac5b2d0ec295_OceanImageBank_HannesKlostermann_10+small+we.jpg?auto=compress,format',
    title: 'Marine biology — underwater life',
    artist: 'Hannes Klostermann / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/24f9a64c-44fa-48ca-aaaa-29b6cc2896ae_OceanImageBank_JettBritnell_19.jpg?auto=compress,format',
    title: 'Grade 6 — ocean discovery',
    artist: 'Jett Britnell / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/977daa12-94f1-471c-a547-694cd9a21e0c_OceanImageBank_ThomasHorig_09.jpg?auto=compress,format',
    title: 'Engineering — ocean technology',
    artist: 'Thomas Horig / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/62de9672-e2f7-4e44-9949-216e7bb340bb_OceanImageBank_RamonaOsche_10.jpg?auto=compress,format',
    title: 'Chemistry — ocean chemical processes',
    artist: 'Ramona Osche / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/aftu2sBOoF08xsNR_OceanImageBank_StudioPONANT_AlexandreHerbrecht_07.jpg?auto=format,compress',
    title: 'Polar Ocean Image Collection',
    artist: 'Studio PONANT, Alexandre Herbrecht / Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/3b7cf259-ce86-4fa7-8966-aa715157060c_Donate_NYTturtle.jpg?auto=compress,format',
    title: 'Sea turtle on coral reef',
    artist: 'Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/21e410b8-5934-400e-aeb4-14407fee926b_Donate_50Reefs2.jpg?auto=compress,format',
    title: 'Global plan to save coral reefs',
    artist: 'Ocean Image Bank',
  },
  {
    url: 'https://images.prismic.io/ocean-agency-cms/88a4d4ca-aa81-4ac0-9c50-bc56817354a6_Donate_CC.jpg?auto=compress,format',
    title: 'Chasing Coral documentary',
    artist: 'Ocean Image Bank',
  },
]

export default function useAquatiqueData() {
  const fallbackRef = useRef(null)
  if (!fallbackRef.current) fallbackRef.current = createFallbackTexture()

  const { ready, textures, loadingError, getImageUrl, getMeta } = useTextureLoader({
    cacheKey: 'aquatique',
    count: COUNT,
    loadFn: () => {
      const meta = ENTRIES.map((e) => ({ ...e }))
      return { urls: meta.map((m) => m.url), meta }
    },
    getMetaFn: (meta) => meta
      ? { title: meta.title, artist: meta.artist, place: 'Ocean Image Bank', date: '' }
      : null,
  })

  const texturePool = useMemo(() => {
    const pool = []
    for (let i = 0; i < COUNT; i++) {
      pool.push({
        texture: textures[i] || fallbackRef.current,
        url: getImageUrl(i) || '',
      })
    }
    return pool
  }, [textures, getImageUrl])

  return { ready, texturePool, textures, loadingError, getImageUrl, getMeta }
}
