const wdk = require('wikidata-sdk')
const referenceSources = require('./sources')
const validateReferenceArgs = require('./validate_reference_args')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, reference) => {
    return validateReferenceArgs(guid, reference)
    .then(() => {
      var snaks

      // reference URL
      if (/^http/.test(reference)) {
        snaks = { P854: [ P854Snak(reference) ] }
      }

      if (referenceSources.includes(reference)) {
        const id = wdk.getNumericId(reference)
        // imported from
        snaks = { P143: [ P143Snak(id) ] }
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

const P854Snak = reference => {
  return {
    snaktype: 'value',
    property: 'P854',
    datavalue: {
      type: 'string',
      value: reference
    }
  }
}

const P143Snak = id => {
  return {
    snaktype: 'value',
    property: 'P143',
    datavalue: {
      type: 'wikibase-entityid',
      value: {
        'entity-type': 'item',
        'numeric-id': id
      }
    }
  }
}
