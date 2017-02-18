const properties = require('./properties')

const dataTypes = {
  ExternalId: 'string',
  String: 'string',
  WikibaseItem: 'claim',
  Time: 'time',
  Monolingualtext: 'string',
  Quantity: 'quantity',
  WikibaseProperty: 'claim',
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

module.exports = (propertyId) => {
  const propData = properties[propertyId]
  const propDataType = dataTypes[propData.type]
  if (propDataType) {
    return propDataType
  } else {
    throw new Error(`datatype isn't supported yet: ${propData.type}.
    Please make a Pull Request to https://github.com/maxlath/wikidata-agent to add support`)
  }
}
