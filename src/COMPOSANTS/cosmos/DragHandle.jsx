import { useState, useRef, useEffect } from 'react'

export function useDragPan() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return
      setPos({
        x: posStart.current.x + (e.clientX - dragStart.current.x),
        y: posStart.current.y + (e.clientY - dragStart.current.y),
      })
    }

    const handleMouseUp = () => {
      isDragging.current = false
      setDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e) => {
    isDragging.current = true
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { x: pos.x, y: pos.y }
  }

  return {
    sceneOffset: { x: pos.x / 120, y: pos.y / -120 },
    dragging,
    pos,
    handleMouseDown,
  }
}

export function DragHandle({ dragging, pos, onMouseDown }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        cursor: dragging ? 'grabbing' : 'grab',
        pointerEvents: onMouseDown ? 'auto' : 'none',
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
      }}
      onMouseDown={onMouseDown}
    />
  )
}
