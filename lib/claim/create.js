const snakPostData = require('./snak_post_data')
const validate = require('../validate')
const formatClaimValue = require('./format_claim_value')

module.exports = (params, properties, instance) => {
  var { id, property, value: rawValue } = params
  const datatype = properties[property]

  validate.entity(id)
  validate.property(property)

  // Format before testing validity to avoid throwing on type errors
  // that could be recovered
  const value = formatClaimValue(datatype, rawValue, instance)

  validate.snakValue(property, datatype, value)

  return snakPostData({
    action: 'wbcreateclaim',
    data: { entity: id, property },
    datatype,
    value,
    instance
  })
}
