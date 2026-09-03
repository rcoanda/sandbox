import { usePhoenixRectoSvg } from './phoenixRectoSvg'

function PhoenixRectoLabel() {
  const __html = usePhoenixRectoSvg()
  return <span dangerouslySetInnerHTML={{ __html }} />
}

export default PhoenixRectoLabel
