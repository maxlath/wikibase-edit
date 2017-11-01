const _ = require('../utils')
const wdk = require('wikidata-sdk')
const getTimeObject = require('./get_time_object')

// The difference in builders are due to the different expectations of Wikidata API

const singleClaimBuilders = {
  string: str => `"${str}"`,
  entity: entityId => JSON.stringify(buildEntity(entityId)),
  time: time => JSON.stringify(getTimeObject(time)),
  // Property type specific builders
  monolingualtext: valueArray => {
    const [ text, language ] = valueArray
    return JSON.stringify({ text, language })
  },
  quantity: (quantity, unit = '1') => JSON.stringify(parseQuantity(quantity, unit))
}

const entityEditBuilders = {
  string: (pid, string) => statementBase(pid, 'string', string),
  entity: (pid, entityId) => {
    return statementBase(pid, 'wikibase-entityid', buildEntity(entityId))
  },
  monolingualtext: (pid, valueObj) => {
    return statementBase(pid, 'monolingualtext', valueObj)
  },
  time: (pid, time) => statementBase(pid, 'time', getTimeObject(time)),
  quantity: (pid, num) => statementBase(pid, 'quantity', parseQuantity(num))
}

const buildEntity = entityId => {
  const id = wdk.getNumericId(entityId)
  const type = entityId[0] === 'Q' ? 'item' : 'property'
  return { 'entity-type': type, 'numeric-id': parseInt(id) }
}

const parseQuantity = (quantity, unit = '1') => {
  if (_.isArray(quantity)) {
    [ quantity, unit ] = quantity
    if (wdk.isItemId(unit)) unit = `http://www.wikidata.org/entity/${unit}`
  }
  return { amount: buildAmount(quantity), unit }
}

const buildAmount = num => {
  if (num === 0) return '0'
  return num > 0 ? `+${num}` : num
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
