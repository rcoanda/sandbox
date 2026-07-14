import { useDico } from '../composants/Dico'
import BackArrow from '../composants/BackArrow'

function Contact() {
  const { t } = useDico()

  const coordonnees = {
    nom: "Jean Dupont",
    adresse: "42 Rue de la République, 75001 Paris",
    telephone: "01 23 45 67 89",
    email: "jean.dupont@email.com",
    site: "www.jeandupont.fr"
  }

  return (
    <div className="p-8 pt-20">
      <BackArrow />
      <h1 className="text-3xl font-bold mb-6">{t('contact.title')}</h1>
      <div className="space-y-3 text-gray-700">
        <p><span className="font-semibold">{t('contact.nom')}</span> {coordonnees.nom}</p>
        <p><span className="font-semibold">{t('contact.adresse')}</span> {coordonnees.adresse}</p>
        <p><span className="font-semibold">{t('contact.telephone')}</span> {coordonnees.telephone}</p>
        <p><span className="font-semibold">{t('contact.email')}</span> {coordonnees.email}</p>
        <p><span className="font-semibold">{t('contact.site')}</span> {coordonnees.site}</p>
      </div>
    </div>
  )
}

export default Contact
