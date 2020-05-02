// A module that turns entity ids into full mediawiki page titles, by checking
// the Wikibase custom namespace configuration
// ex: P1 => Property:P1, Q1 => Q1 OR Item:Q1

const { isEntityId } = require('wikibase-sdk')
const fetch = require('./request/fetch')
var prefixesMapPromise

module.exports = async (title, instance) => {
  if (!isEntityId(title)) return
  prefixesMapPromise = prefixesMapPromise || getPrefixesMap(instance)
  const prefixesMap = await prefixesMapPromise
  const idFirstLetter = title[0]
  const prefix = prefixesMap[idFirstLetter]
  return prefix === '' ? title : `${prefix}:${title}`
}

const getPrefixesMap = instance => {
  const infoUrl = `${instance}/w/api.php?action=query&meta=siteinfo&siprop=namespaces&format=json`
  return fetch(infoUrl)
  .then(res => res.json())
  .then(parsePrefixesMap)
}

const parsePrefixesMap = res => {
  return Object.values(res.query.namespaces)
  .filter(namespace => namespace.defaultcontentmodel)
  .filter(namespace => namespace.defaultcontentmodel.startsWith('wikibase'))
  .reduce(aggregatePrefixes, {})
}

const aggregatePrefixes = (prefixesMap, namespace) => {
  const { defaultcontentmodel, '*': prefix } = namespace
  const type = defaultcontentmodel.split('-')[1]
  const firstLetter = type === 'item' ? 'Q' : type[0].toUpperCase()
  prefixesMap[firstLetter] = prefix
  return prefixesMap
}
