const findPropertyDataType = require('../properties/find_datatype')
const { entityEditBuilders: builders } = require('../claim/builders')

module.exports = (property, value) => {
  value = value.value || value
  const datatype = findPropertyDataType(property)
  return builders[datatype](property, value).mainsnak
}
