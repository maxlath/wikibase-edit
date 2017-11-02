const validate = require('../validate')
const getBuilder = require('../claim/get_builder')
const getEntityClaims = require('../claim/get_entity_claims')
const wdk = require('wikidata-sdk')
const _ = require('../utils')
const error_ = require('../error')
const findPropertyDataType = require('../properties/find_datatype')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, property, oldValue, newValue) => {
    const key = _.buildKey(guid, property, oldValue, newValue)

    return Promise.resolve()
    .then(() => {
      validate.guid(guid)
      validate.property(property)
      validate.qualifierValue(property, oldValue)
      validate.qualifierValue(property, newValue)

      if (oldValue === newValue) {
        throw error_.new('same value', 400, oldValue, newValue)
      }

      // Get current value snak hash
      return getSnakHash(config, guid, property, oldValue)
      .then(snakhash => {
        // Set it to its new value
        return post('wbsetqualifier', {
          snaktype: 'value',
          claim: guid,
          property,
          snakhash,
          value: getBuilder(property)(newValue)
        })
      })
    })
    .then(Log(`add qualifier res (${key})`))
    .catch(LogError(`add qualifier err (${key}`))
  }
}

const getSnakHash = (config, guid, property, oldValue) => {
  const entityId = guid.split('$')[0]
  return getEntityClaims(config, entityId)
  .then(claims => {
    const claim = findClaim(claims, guid)
    if (!claim) {
      throw error_.new('claim not found', 400, guid)
    }
    const qualifier = findQualifier(claim, property, oldValue)
    if (!qualifier) {
      throw error_.new('qualifier not found', 400, guid, property, oldValue)
    }
    return qualifier.hash
  })
}

const findClaim = (claims, guid) => {
  claims = _.flatten(Object.values(claims))
  for (let claim of claims) {
    if (claim.id === guid) return claim
  }
}

const findQualifier = (claim, property, value) => {
  const datatype = findPropertyDataType(property)
  const propQualifiers = claim.qualifiers[property]
  if (!propQualifiers) return
  for (let qualifier of propQualifiers) {
    if (sameValue(datatype, qualifier, value)) return qualifier
  }
}

const sameValue = (datatype, qualifier, value) => {
  const qualifierValue = wdk.simplifyClaim(qualifier)
  const comparator = valueComparators[datatype]
  if (comparator) {
    return comparator(qualifier, qualifierValue, value)
  } else {
    return qualifierValue === value
  }
}

const valueComparators = {
  time: (qualifier, qualifierValue, value) => cleanTime(qualifierValue) === value,
  quantity: (qualifier, qualifierValue, value) => {
    if (_.isPlainObject(value)) {
      if (value.unit !== getUnit(qualifier)) return false
      return parseAmount(value.amount) === qualifierValue
    } else {
      return qualifierValue === value
    }
  },
  monolingualtext: (qualifier, qualifierValue, value) => {
    const { language } = qualifier.datavalue.value
    if (language !== value.language) return false
    return qualifierValue === value.text
  }
}

const cleanTime = time => {
  // Turn '+1802-00-00T00:00:00Z' into '1802'
  return time
  // Remove T00:00:00.000Z or T00:00:00Z
  .replace(/T[0:.]+Z/, '')
  // Remove empty month or day values
  .replace(/-00/g)
  // Remove positive signs
  .replace(/^\+/)
}

const getUnit = qualifier => {
  return qualifier.datavalue.value.unit
  .replace('http://www.wikidata.org/entity/', '')
}

const parseAmount = amount => _.isString(amount) ? parseFloat(amount) : amount
