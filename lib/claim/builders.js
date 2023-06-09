import { getNumericId } from 'wikibase-sdk'
import getTimeObject from './get_time_object.js'
import { parseQuantity } from './quantity.js'

// The difference in builders are due to the different expectations of the Wikibase API

export const singleClaimBuilders = {
  string: str => `"${str}"`,
  entity: entityId => JSON.stringify(buildEntity(entityId)),
  time: value => JSON.stringify(getTimeObject(value)),
  // Property type specific builders
  monolingualtext: valueObj => JSON.stringify(valueObj),
  quantity: (amount, instance) => JSON.stringify(parseQuantity(amount, instance)),
  globecoordinate: obj => JSON.stringify(obj),
}

export const entityEditBuilders = {
  string: (pid, value) => valueStatementBase(pid, 'string', value),
  entity: (pid, value) => {
    return valueStatementBase(pid, 'wikibase-entityid', buildEntity(value))
  },
  monolingualtext: (pid, value) => {
    return valueStatementBase(pid, 'monolingualtext', value)
  },
  time: (pid, value) => valueStatementBase(pid, 'time', getTimeObject(value)),
  quantity: (pid, value, instance) => valueStatementBase(pid, 'quantity', parseQuantity(value, instance)),
  globecoordinate: (pid, value) => valueStatementBase(pid, 'globecoordinate', value),
  specialSnaktype: (pid, snaktype) => statementBase(pid, snaktype),
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
      snaktype,
    },
  }
}

const valueStatementBase = (pid, type, value) => {
  const statement = statementBase(pid, 'value')
  statement.mainsnak.datavalue = { type, value }
  return statement
}
