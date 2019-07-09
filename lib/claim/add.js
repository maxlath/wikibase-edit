const snakPostData = require('./snak_post_data')
const validate = require('../validate')
const { parseQuantity } = require('./quantity')
const { hasSpecialSnaktype } = require('./special_snaktype')

module.exports = (params, properties) => {
  var { id, property, value: rawValue } = params
  const datatype = properties[property]

  validate.entity(id)
  validate.property(property)

  // Format before testing validity to avoid throwing on type errors
  // that could be recovered
  value = formatClaimValue(datatype, rawValue)

  validate.claimValue(property, datatype, value)

  return snakPostData({
    action: 'wbcreateclaim',
    data: { entity: id, property },
    datatype,
    value
  })
}

const formatClaimValue = (datatype, value) => {
  if (hasSpecialSnaktype(value)) return value
  // Try to recover data passed in a different type than the one expected:
  // - Quantities should be of type number
  if (datatype === 'Quantity') return parseQuantity(value)
  return value
}
