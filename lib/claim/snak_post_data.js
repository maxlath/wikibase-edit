const { singleClaimBuilders: builders } = require('./builders')
const { hasSpecialSnaktype } = require('./special_snaktype')
const datatypesToBuilderDatatypes = require('../properties/datatypes_to_builder_datatypes')

module.exports = params => {
  const { action, data, datatype, value } = params

  if (!datatype) throw new Error('missing datatype')

  if (hasSpecialSnaktype(value)) {
    data.snaktype = value.snaktype
  } else {
    data.snaktype = 'value'
    builderDatatype = datatypesToBuilderDatatypes[datatype] || datatype
    data.value = builders[builderDatatype](value)
  }

  return { action, data }
}
