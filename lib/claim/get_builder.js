const findPropertyDataType = require('../properties/find_datatype')
const { singleClaimBuilders: builders } = require('./builders')

module.exports = property => {
  const datatype = findPropertyDataType(property)
  return builders[datatype]
}
