function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <span style={{ color: '#888', fontSize: 18, letterSpacing: '0.05em' }}>
        Chargement...
      </span>
    </div>
  )
}

export default Loading
