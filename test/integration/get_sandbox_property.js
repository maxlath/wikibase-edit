const config = require('config')
const wbk = require('wikibase-sdk')({ instance: config.instance })
const sandboxProperties = {}
const breq = require('bluereq')
const wbEdit = require('../..')(config)

module.exports = datatype => {
  return getPropertyId(datatype)
  .then(propertyId => {
    sandboxProperties[datatype] = propertyId
    return propertyId
  })
}

const getPropertyId = datatype => {
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
    if (firstWbResult) return firstWbResult.id
  })
}

const createProperty = datatype => {
  const pseudoPropertyId = getPseudoPropertyId(datatype)
  return wbEdit.entity.create(config, {
    type: 'property',
    datatype,
    labels: {
      en: pseudoPropertyId
    }
  })
  .then(res => res.entity.id)
}

const getPseudoPropertyId = datatype => `${datatype} sandbox property`
