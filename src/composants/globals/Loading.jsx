import { useDico } from './Dico'

function Loading({ error }) {
  const { t } = useDico()

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
      <span style={{ color: error ? '#c44' : '#888', fontSize: 18, letterSpacing: '0.05em' }}>
        {error ? t('loadingError') : t('loading')}
      </span>
    </div>
  )
}

export default Loading
