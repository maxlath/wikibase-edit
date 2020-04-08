const config = require('config')
const { __ } = config
const wbk = require('wikibase-sdk')({ instance: config.instance })
const sandboxProperties = {}
const fetch = require('cross-fetch')
const wbEdit = __.require('.')(config)

module.exports = async datatype => {
  if (!datatype) throw new Error('missing datatype')
  const property = await getProperty(datatype)
  sandboxProperties[datatype] = property
  return property
}

const getProperty = async datatype => {
  const pseudoPropertyId = getPseudoPropertyId(datatype)

  const cachedPropertyId = sandboxProperties[pseudoPropertyId]

  if (cachedPropertyId) return Promise.resolve(cachedPropertyId)

  const foundPropertyId = await findOnWikibase(pseudoPropertyId)
  if (foundPropertyId) return foundPropertyId
  else return createProperty(datatype)
}

const findOnWikibase = async pseudoPropertyId => {
  const url = wbk.searchEntities({ search: pseudoPropertyId, type: 'property' })
  const body = await fetch(url).then(res => res.json())
  const firstWbResult = body.search[0]
  if (firstWbResult) return firstWbResult
}

const createProperty = async datatype => {
  const pseudoPropertyId = getPseudoPropertyId(datatype)
  const res = await wbEdit.entity.create({
    type: 'property',
    datatype,
    labels: {
      en: pseudoPropertyId
    }
  })
  return res.entity
}

const getPseudoPropertyId = datatype => `${datatype} sandbox property`
