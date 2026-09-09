// Service qui récupère les noms de fichiers 
// et fournit les URLs Cloudinary correspondantes, avec mise en cache.
const cache = {}

function buildUrl(fileName) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,w_512,c_scale/${fileName}`
}

async function fetchUrls(source) {
    const res = await fetch(`${import.meta.env.BASE_URL}${source}`)
    const data = await res.json()
    return data.files.map(buildUrl)
}

export function getPeopleUrls(source) {
    if (!cache[source]) cache[source] = fetchUrls(source)
    return cache[source]
}