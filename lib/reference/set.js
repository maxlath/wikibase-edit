const validate = require('../validate')
const { buildSnak, buildReference } = require('../claim/snak')

module.exports = (params, properties) => {
  const { guid, property, value } = params
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

  return {
    action: 'wbsetreference',
    data: {
      statement: guid,
      snaks: JSON.stringify(snaks)
    }
  }
}
