const { singleClaimBuilders: builders } = require('./builders')
const { hasSpecialSnaktype } = require('./special_snaktype')
const datatypesToBuilderDatatypes = require('../properties/datatypes_to_builder_datatypes')
const error_ = require('../error')

module.exports = params => {
  const { action, data, datatype, value } = params

  if (!datatype) throw error_.new('missing datatype', params)

  if (hasSpecialSnaktype(value)) {
    data.snaktype = value.snaktype
  } else {
    data.snaktype = 'value'
    builderDatatype = datatypesToBuilderDatatypes[datatype] || datatype
    data.value = builders[builderDatatype](value)
  }

  return { action, data }
}
