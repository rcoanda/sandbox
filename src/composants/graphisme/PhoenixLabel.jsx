import { PHOENIX_LABEL_INNER, PHOENIX_LABEL_VIEWBOX } from './phoenixSvg'

function PhoenixLabel() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={PHOENIX_LABEL_VIEWBOX}
      width="420"
      height="580"
      role="img"
      aria-label="Étiquette dos de flacon Phoenix avec phénix en vol"
      dangerouslySetInnerHTML={{ __html: PHOENIX_LABEL_INNER }}
    />
  )
}

export default PhoenixLabel