import { buildSnak, buildReference } from '../claim/snak.js'
import validate from '../validate.js'

export default (params, properties) => {
  const { guid, property, value, hash } = params
  let { snaks } = params
  if (snaks) {
    snaks = buildReference(properties)(snaks).snaks
  } else {
    // Legacy interface
    validate.guid(guid)
    validate.property(property)
    const datatype = properties[property]
    validate.snakValue(property, datatype, value)
    snaks = {}
    snaks[property] = [ buildSnak(property, datatype, value) ]
  }

  const data = {
    statement: guid,
    snaks: JSON.stringify(snaks),
  }

  if (hash) {
    validate.hash(hash)
    data.reference = hash
  }

  return { action: 'wbsetreference', data }
}
