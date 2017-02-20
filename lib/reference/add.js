const wdk = require('wikidata-sdk')
const refSources = require('./sources')

module.exports = (config) => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, ref) => {
    var snaks

    // reference URL
    if (/^http/.test(ref)) {
      snaks = { P854: [ P854Snak(ref) ] }
    }

    if (refSources.includes(ref)) {
      const id = wdk.getNumericId(ref)
      // imported from
      snaks = { P143: [ P143Snak(id) ] }
    }

    return post('wbsetreference', {
      statement: guid,
      snaks: JSON.stringify(snaks)
    })
    .then(Log(`add reference res (${guid}:${ref})`))
    .catch(LogError(`add reference err (${guid}:${ref})`))
  }
}

const P854Snak = (ref) => {
  return {
    snaktype: 'value',
    property: 'P854',
    datavalue: {
      type: 'string',
      value: ref
    }
  }
}

const P143Snak = (id) => {
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
