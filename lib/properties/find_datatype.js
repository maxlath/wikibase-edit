let properties = require('./properties')

const dataTypes = {
  ExternalId: 'string',
  String: 'string',
  WikibaseItem: 'entity',
  Time: 'time',
  Monolingualtext: 'monolingualtext',
  Quantity: 'quantity',
  GlobeCoordinate: 'globecoordinate',
  WikibaseProperty: 'entity',
  Url: 'string',
  CommonsMedia: 'string'
}
// Not Supported yet:
// - Math
// - CommonsMedia
// To add support:
// - attribute them one of the existing datatypes (string, claims, time, or
//   quantity)
// - add a corresponding test and build function in lib/claim/tests.js and lib/claim/builders.js

const findPropertyDataType = (propertyId) => {
  const propData = properties[propertyId]
  if( !propData ) {
    throw new Error(`property isn't supported yet: ${propertyId}.
    Please request an update of properties at https://github.com/maxlath/wikidata-edit/issue`)
  }
  const propDataType = dataTypes[propData.type]
  if( !propDataType ){
      throw new Error(`datatype isn't supported yet: ${propData.type} (${propertyId} datatype).
      Please open an issue to add support at https://github.com/maxlath/wikidata-edit/issue`)
  }
  return propDataType
}


const setProperties = (customProperties) => {
  properties = customProperties
}

module.exports = {
  findPropertyDataType,
  setProperties,
}
