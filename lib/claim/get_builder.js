const findPropertyDataType = require('../properties/find_datatype')
const properties = require('../properties/properties')
const { singleClaimBuilders: builders } = require('./builders')

module.exports = property => {
  const propType = properties[property].type.toLowerCase()
  const datatype = findPropertyDataType(property)
  // Use a builder specific to the proptype or a more generalist builder
  return builders[propType] || builders[datatype]
}
