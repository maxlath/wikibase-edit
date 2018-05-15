const wdk = require('wikidata-sdk')
const getTimeObject = require('./get_time_object')
const { parseQuantity } = require('./quantity')
const { parseGlobCoordinate } = require('./globecoordinate')

// The difference in builders are due to the different expectations of Wikidata API

const singleClaimBuilders = {
  string: str => `"${str}"`,
  entity: entityId => JSON.stringify(buildEntity(entityId)),
  time: (time, precision) => JSON.stringify(getTimeObject(time, precision)),
  // Property type specific builders
  monolingualtext: valueObj => JSON.stringify(valueObj),
  quantity: (quantity, unit = '1') => JSON.stringify(parseQuantity(quantity, unit)),
  globecoordinate: (obj) => JSON.stringify(obj)
}

const entityEditBuilders = {
  string: (pid, string) => statementBase(pid, 'string', string),
  entity: (pid, entityId) => {
    return statementBase(pid, 'wikibase-entityid', buildEntity(entityId))
  },
  monolingualtext: (pid, valueObj) => {
    return statementBase(pid, 'monolingualtext', valueObj)
  },
  time: (pid, time, precision) => statementBase(pid, 'time', getTimeObject(time, precision)),
  quantity: (pid, num) => statementBase(pid, 'quantity', parseQuantity(num)),
  globecoordinate: (pid, obj) => statementBase(pid, 'globecoordinate', parseGlobCoordinate(num))
}

const buildEntity = entityId => {
  const id = wdk.getNumericId(entityId)
  const type = entityId[0] === 'Q' ? 'item' : 'property'
  return { 'entity-type': type, 'numeric-id': parseInt(id) }
}

const statementBase = (pid, type, value) => {
  return {
    rank: 'normal',
    type: 'statement',
    mainsnak: {
      datavalue: { type, value },
      property: pid,
      snaktype: 'value'
    }
  }
}

module.exports = { singleClaimBuilders, entityEditBuilders }
