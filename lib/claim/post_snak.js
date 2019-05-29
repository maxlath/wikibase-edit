const findPropertyDataType = require('../properties/find_datatype')
const { singleClaimBuilders: builders } = require('./builders')
const { hasSpecialSnaktype } = require('./special_snaktype')

module.exports = params => {
  const { post, action, data, value } = params

  if (hasSpecialSnaktype(value)) {
    data.snaktype = value.snaktype
  } else {
    data.snaktype = 'value'
    const { property } = data
    const datatype = findPropertyDataType(property)
    data.value = builders[datatype](value)
  }

  return post(action, data)
}
