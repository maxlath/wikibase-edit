const wdk = require('wikidata-sdk')
const referenceSources = require('./sources')
const validateReferenceArgs = require('./validate_reference_args')
const findPropertyDataType = require('../properties/find_datatype')

module.exports = (config) => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, property, reference) => {
    return validateReferenceArgs(guid, property, reference)
    .then(() => {
      var snaks

      if (wdk.isItemId(reference)) {
          const id = wdk.getNumericId(reference)
          snaks = { property: [ itemSnak(id, property) ] }
      } else {
          snaks = { property: [ genericSnak(reference, property) ] }
      }

      return post('wbsetreference', {
        statement: guid,
        snaks: JSON.stringify(snaks)
      })
    })
    .then(Log(`add reference res (${guid}:${reference})`))
    .catch(LogError(`add reference err (${guid}:${reference})`))
  }
}

const genericSnak = (reference, property) => {
  return {
    snaktype: 'value',
    property: property,
    datavalue: {
      type: findPropertyDataType(property),
      value: reference
    }
  }
}

const itemSnak = (id, property) => {
  return {
    snaktype: 'value',
    property: property,
    datavalue: {
      type: 'wikibase-entityid',
      value: {
        'entity-type': 'item',
        'numeric-id': id
      }
    }
  }
}
