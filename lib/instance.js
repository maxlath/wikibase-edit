const defaultInstance = 'https://www.wikidata.org/w/api.php'

module.exports = (config = {}) => {
  const { wikibaseInstance } = config
  return {
    base: wikibaseInstance || defaultInstance,
    customize: url => {
      if (wikibaseInstance) {
        return url.replace(defaultInstance, wikibaseInstance)
      } else {
        return url
      }
    }
  }
}
