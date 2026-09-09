import { phoenixSVGVerso } from './phoenixSVGVerso'

function PhoenixSVGVersoLabel() {
  const __html = phoenixSVGVerso()
  return <span dangerouslySetInnerHTML={{ __html }} />
}

export default PhoenixSVGVersoLabel