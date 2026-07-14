import { useDico } from '../composants/Dico'
import BackArrow from '../composants/BackArrow'

function About() {
  const { t } = useDico()

  return (
    <div className="p-8 pt-20">
      <BackArrow />
      <h1 className="text-3xl font-bold">{t('about.title')}</h1>
      <p className="mt-4 text-gray-600">{t('about.subtitle')}</p>
    </div>
  )
}

export default About
