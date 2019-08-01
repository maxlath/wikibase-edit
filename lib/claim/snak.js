const { findPropertyDataType } = require('../properties/find_datatype')
const { entityEditBuilders: builders } = require('../claim/builders')

module.exports = (property, value) => {
  value = value.value || value
  if (value && value.snaktype && value.snaktype !== 'value') {
    return { snaktype: value.snaktype, property }
  }
  const datatype = findPropertyDataType(property)
  return builders[datatype](property, value).mainsnak
}
