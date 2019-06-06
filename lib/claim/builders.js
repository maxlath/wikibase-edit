const { getNumericId } = require('wikibase-sdk')
const getTimeObject = require('./get_time_object')
const { parseQuantity } = require('./quantity')

// The difference in builders are due to the different expectations of Wikidata API

const singleClaimBuilders = {
  string: str => `"${str}"`,
  entity: entityId => JSON.stringify(buildEntity(entityId)),
  time: (time, precision) => JSON.stringify(getTimeObject(time, precision)),
  // Property type specific builders
  monolingualtext: valueObj => JSON.stringify(valueObj),
  quantity: (quantity, unit = '1') => JSON.stringify(parseQuantity(quantity, unit)),
  globecoordinate: obj => JSON.stringify(obj)
}

const entityEditBuilders = {
  string: (pid, string) => valueStatementBase(pid, 'string', string),
  entity: (pid, entityId) => {
    return valueStatementBase(pid, 'wikibase-entityid', buildEntity(entityId))
  },
  monolingualtext: (pid, valueObj) => {
    return valueStatementBase(pid, 'monolingualtext', valueObj)
  },
  time: (pid, time, precision) => valueStatementBase(pid, 'time', getTimeObject(time, precision)),
  quantity: (pid, num) => valueStatementBase(pid, 'quantity', parseQuantity(num)),
  globecoordinate: (pid, obj) => valueStatementBase(pid, 'globecoordinate', obj),
  specialSnaktype: (pid, snaktype) => statementBase(pid, snaktype)
}

const buildEntity = entityId => {
  entityId = entityId.value || entityId
  const id = getNumericId(entityId)
  const type = entityId[0] === 'Q' ? 'item' : 'property'
  return { 'entity-type': type, 'numeric-id': parseInt(id) }
}

const statementBase = (pid, snaktype, value) => {
  return {
    rank: 'normal',
    type: 'statement',
    mainsnak: {
      property: pid,
      snaktype: snaktype
    }
  }
}

const valueStatementBase = (pid, type, value) => {
  const statement = statementBase(pid, 'value')
  statement.mainsnak.datavalue = { type, value }
  return statement
}

module.exports = { singleClaimBuilders, entityEditBuilders }
