const datatypesToBuilderDatatypes = require('../properties/datatypes_to_builder_datatypes')
const { entityEditBuilders: builders } = require('./builders')

module.exports = (property, datatype, value) => {
  value = value.value || value
  if (value && value.snaktype && value.snaktype !== 'value') {
    return { snaktype: value.snaktype, property }
  }
  const builderDatatype = datatypesToBuilderDatatypes[datatype]
  return builders[builderDatatype](property, value).mainsnak
}
