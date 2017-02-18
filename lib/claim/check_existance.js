const wdk = require('wikidata-sdk')
const { get } = require('../request')
const error_ = require('../error')

module.exports = (config) => {
  const replaceInstance = require('../replace_instance.js')(config)
  return (entity, property, value) => {
    if (!wdk.isWikidataEntityId(entity)) {
      return error_.reject('invalid entity', 400)
    }

    if (!wdk.isWikidataPropertyId(property)) {
      return error_.reject('invalid property', 400)
    }

    if (!value) {
      return error_.reject('missing value', 400)
    }

    var url = wdk.getEntities({ ids: entity, properties: 'claims' })
    url = replaceInstance(url)

    return get(url)
    .then(body => {
      const propClaims = body.entities[entity].claims[property]
      if (!propClaims) return false
      const propClaimsValues = wdk.simplifyPropertyClaims(propClaims)
      return propClaimsValues.includes(value)
    })
  }
}
