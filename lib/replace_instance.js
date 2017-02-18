const defaultInstance = 'https://www.wikidata.org'

module.exports = (config = {}) =>  {
  const { wikibaseInstance } = config
  return (url) => {
    if (wikibaseInstance) {
      return url.replace(defaultInstance, wikibaseInstance)
    } else {
      return url
    }
  }
}
