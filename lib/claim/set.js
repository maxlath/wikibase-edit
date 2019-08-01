const validate = require('../validate')
const formatClaimValue = require('./format_claim_value')
const snak = require('./snak')

module.exports = (params, properties) => {
  var { guid, property, value: rawValue } = params
  const datatype = properties[property]

  validate.guid(guid)
  validate.property(property)

  // Format before testing validity to avoid throwing on type errors
  // that could be recovered
  value = formatClaimValue(datatype, rawValue)

  validate.claimValue(property, datatype, value)

  const claim = {
    id: guid,
    type: 'statement',
    mainsnak: snak(property, datatype, value)
  }

  return { action: 'wbsetclaim', data: { claim: JSON.stringify(claim) } }
}
