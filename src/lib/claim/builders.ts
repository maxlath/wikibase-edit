import { findEntityTypeFromId } from 'wikibase-sdk'
import { getTimeObject, type CustomTimeSnakDataValueValue } from './get_time_object.js'
import { parseQuantity } from './quantity.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { Claim, EntityId, MonolingualTextSnakDataValue, PropertyId, Snak, SnakDataValue, SnakType, WikibaseEntityIdSnakDataValue, SnakDatavalueType, SnakDataValueByDatavalueType } from 'wikibase-sdk'

// The difference in builders are due to the different expectations of the Wikibase API

export const singleClaimBuilders = {
  string (str: string) {
    return `"${str}"`
  },
  entity (entityId: EntityId) {
    return JSON.stringify(buildEntitySnakDataValue(entityId))
  },
  time (value: CustomTimeSnakDataValueValue | string | number) {
    return JSON.stringify(getTimeObject(value))
  },
  // Property type specific builders
  monolingualtext (valueObj: MonolingualTextSnakDataValue['value']) {
    return JSON.stringify(valueObj)
  },
  quantity (amount: number, instance: AbsoluteUrl) {
    return JSON.stringify(parseQuantity(amount, instance))
  },
  globecoordinate (obj) {
    return JSON.stringify(obj)
  },
}

export const entityEditBuilders = {
  string (pid: PropertyId, value) {
    return valueStatementBase(pid, 'string', value)
  },
  entity (pid: PropertyId, value: EntityId | WikibaseEntityIdSnakDataValue) {
    const datavalue = buildEntitySnakDataValue(value)
    return valueStatementBase(pid, 'wikibase-entityid', datavalue)
  },
  monolingualtext (pid: PropertyId, value) {
    return valueStatementBase(pid, 'monolingualtext', value)
  },
  time (pid: PropertyId, value) {
    return valueStatementBase(pid, 'time', getTimeObject(value))
  },
  quantity (pid: PropertyId, value, instance?: AbsoluteUrl) {
    return valueStatementBase(pid, 'quantity', parseQuantity(value, instance))
  },
  globecoordinate (pid: PropertyId, value) {
    return valueStatementBase(pid, 'globecoordinate', value)
  },
  specialSnaktype (pid: PropertyId, snaktype: SnakType) {
    return statementBase(pid, snaktype)
  },
}

function buildEntitySnakDataValue (entityId: EntityId | WikibaseEntityIdSnakDataValue): WikibaseEntityIdSnakDataValue['value'] {
  const id = typeof entityId === 'string' ? entityId : entityId.value.id
  const type = findEntityTypeFromId(id)
  // @ts-expect-error
  return { id, 'entity-type': type }
}

type ClaimDraft = Pick<Claim, 'rank' | 'type'> & {
  mainsnak: Pick<Snak, 'property' | 'snaktype'> & { datavalue?: SnakDataValue }
}

function statementBase (pid: PropertyId, snaktype: SnakType): ClaimDraft {
  return {
    rank: 'normal',
    type: 'statement',
    mainsnak: {
      property: pid,
      snaktype,
    },
  }
}

function valueStatementBase <T extends SnakDatavalueType> (pid: PropertyId, type: T, value: SnakDataValueByDatavalueType[T]['value']) {
  const statement = statementBase(pid, 'value')
  // @ts-expect-error
  statement.mainsnak.datavalue = { type, value }
  return statement
}
