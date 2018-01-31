const properties = require('./properties')

const dataTypes = {
  ExternalId: 'string',
  String: 'string',
  WikibaseItem: 'entity',
  Time: 'time',
  Monolingualtext: 'monolingualtext',
  Quantity: 'quantity',
  WikibaseProperty: 'entity',
  Url: 'string'
}
// Not Supported yet:
// - Math
// - GlobeCoordinate
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
  const propDataType = dataTypes[propData.type]
  if (propDataType) {
    return propDataType
  } else {
    throw new Error(`datatype isn't supported yet: ${propData.type}.
    Please open an issue to add support at https://github.com/maxlath/wikidata-edit/issue`)
  }
}
