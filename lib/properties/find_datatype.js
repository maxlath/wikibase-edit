const properties = require('./properties')
const datatypes = require('./datatypes')

// Not Supported yet:
// - Math
// - CommonsMedia
// To add support:
// - attribute them one of the existing datatypes (string, claims, time, or
//   quantity)
// - add a corresponding test and build function in lib/claim/tests.js and lib/claim/builders.js

const getPropertyData = propertyId => {
  const propData = properties[propertyId]
  if (propData) {
    return propData
  } else {
    throw new Error(`property isn't supported yet: ${propertyId}.
    Please request an update of proprerties at https://github.com/maxlath/wikidata-edit/issue`)
  }
}

module.exports = propertyId => {
  const propData = getPropertyData(propertyId)
  const propDatatype = datatypes[propData.type]
  if (propDatatype) {
    return propDatatype
  } else {
    throw new Error(`datatype isn't supported yet: ${propData.type} (${propertyId} datatype).
    Please open an issue to add support at https://github.com/maxlath/wikidata-edit/issue`)
  }
}
