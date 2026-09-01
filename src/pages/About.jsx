import usePageDico from '../composants/Dico'
import BackArrow from '../composants/BackArrow'

function About() {
  const dico = usePageDico('about')

  return (
    <div className="p-8 pt-20">
      <BackArrow />
      <h1 className="text-3xl font-bold">{dico?.title}</h1>
      <p className="mt-4 text-gray-600">{dico?.subtitle}</p>
      <p className="mt-4 text-gray-600">{dico?.version}</p>
      {dico?.description && (
        <p className="mt-6 whitespace-pre-line text-gray-700 leading-relaxed">
          {dico.description}
        </p>
      )}
    </div>
  )
}

export default About
