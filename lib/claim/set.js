const validate = require('../validate')
const formatClaimValue = require('./format_claim_value')
const { buildSnak } = require('./snak')

module.exports = (params, properties, instance) => {
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
    mainsnak: buildSnak(property, datatype, value)
  }

  return { action: 'wbsetclaim', data: { claim: JSON.stringify(claim) } }
}
