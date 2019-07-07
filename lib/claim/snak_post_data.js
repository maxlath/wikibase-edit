const findPropertyDataType = require('../properties/find_datatype')
const { singleClaimBuilders: builders } = require('./builders')
const { hasSpecialSnaktype } = require('./special_snaktype')
const datatypes = require('../properties/datatypes')

module.exports = params => {
  const { post, action, data, datatype, value } = params

  if (!datatype) throw new Error('missing datatype')

  if (hasSpecialSnaktype(value)) {
    data.snaktype = value.snaktype
  } else {
    data.snaktype = 'value'
    builderDatatype = datatypes[datatype] || datatype
    data.value = builders[builderDatatype](value)
  }

  return { action, data }
}
