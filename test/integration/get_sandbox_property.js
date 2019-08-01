const config = require('config')
const wbk = require('wikibase-sdk')({ instance: config.instance })
const sandboxProperties = {}
const breq = require('bluereq')
const wbEdit = require('../..')(config)

module.exports = datatype => {
  if (!datatype) throw new Error('missing datatype')
  return getProperty(datatype)
  .then(property => {
    sandboxProperties[datatype] = property
    return property
  })
}

const getProperty = datatype => {
  const pseudoPropertyId = getPseudoPropertyId(datatype)

  const cachedPropertyId = sandboxProperties[pseudoPropertyId]

  if (cachedPropertyId) return Promise.resolve(cachedPropertyId)

  return findOnWikibase(pseudoPropertyId)
  .then(foundPropertyId => {
    if (foundPropertyId) return foundPropertyId
    else return createProperty(datatype)
  })
}

const findOnWikibase = pseudoPropertyId => {
  const url = wbk.searchEntities({ search: pseudoPropertyId, type: 'property' })
  return breq.get(url)
  .then(res => {
    const firstWbResult = res.body.search[0]
    if (firstWbResult) return firstWbResult
  })
}

const createProperty = datatype => {
  const pseudoPropertyId = getPseudoPropertyId(datatype)
  return wbEdit.entity.create({
    type: 'property',
    datatype,
    labels: {
      en: pseudoPropertyId
    }
  })
  .then(res => res.entity)
}

const getPseudoPropertyId = datatype => `${datatype} sandbox property`
