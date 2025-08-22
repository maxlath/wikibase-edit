import * as validate from '../validate.js'
import formatClaimValue from './format_claim_value.js'
import { buildSnak } from './snak.js'

export function setClaim (params, properties, instance) {
  const { guid, property, value: rawValue } = params
  const datatype = properties[property]

  validate.guid(guid)
  validate.property(property)

  // Format before testing validity to avoid throwing on type errors
  // that could be recovered
  const value = formatClaimValue(datatype, rawValue, instance)

  validate.snakValue(property, datatype, value)

  const claim = {
    id: guid,
    type: 'statement',
    mainsnak: buildSnak(property, datatype, value),
  }

  return { action: 'wbsetclaim', data: { claim: JSON.stringify(claim) } }
}
