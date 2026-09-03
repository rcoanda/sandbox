import { phoenixVersoSvg } from './pheonixVersoSvg'

function PhoenixVersoLabel() {
  const __html = phoenixVersoSvg()
  return <span dangerouslySetInnerHTML={{ __html }} />
}

export default PhoenixVersoLabel
