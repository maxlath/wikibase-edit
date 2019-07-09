const WBK = require('wikibase-sdk')
const breq = require('bluereq')
const { forceArray } = require('../utils')
const error_ = require('../error')

module.exports = (config, propertyIds) => {
  config.properties = config.properties || {}
  const { properties, wbk } = config

  const promises = propertyIds
    .map(propertyId => {
      if (!wbk.isPropertyId(propertyId)) throw error_.new('invalid property', 500, propertyId)
      if (properties[propertyId]) return
      return getPropertyDatatype(wbk, properties, propertyId)
    })

  return Promise.all(promises)
}

const getPropertyDatatype = (wbk, properties, propertyId) => {
  const url = wbk.getEntities({ ids: propertyId, props: 'info' })

  return breq.get(url)
  .then(res => {
    const property = res.body.entities[propertyId]
    if (!property) throw error_.new('property not found', 500, propertyId)
    properties[propertyId] = property.datatype
  })
}
