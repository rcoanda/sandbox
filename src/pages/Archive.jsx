import { categoryLinks } from '../composants/CategoryMenu'
import { useDico } from '../composants/Dico'
import BackArrow from '../composants/BackArrow'

function Archive() {
  const { t } = useDico()
  const categories = Object.entries(categoryLinks)

  return (
    <div className="p-8 pt-20">
      <BackArrow />
      <h1 className="text-3xl font-bold mb-6">{t('archive.title')}</h1>
      <div className="space-y-6 max-w-md">
        {categories.map(([key, pages]) => (
          <div key={key}>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
              {t('archive.categories.' + key) || key}
            </h2>
            <ul className="space-y-1">
              {pages.map((page) => (
                <li key={page.path}>
                  <a
                    href={page.path}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {t('menu.' + page.path) || page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Archive
