import { usePhoenixRectoSvg } from './PhoenixSVGRecto'

function PhoenixSVGRectoLabel() {
  const __html = usePhoenixRectoSvg()
  return <span dangerouslySetInnerHTML={{ __html }} />
}

export default PhoenixSVGRectoLabel