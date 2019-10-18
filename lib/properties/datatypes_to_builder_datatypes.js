const buildersByNormalizedDatatypes = {
  externalid: 'string',
  string: 'string',
  wikibaseitem: 'entity',
  time: 'time',
  monolingualtext: 'monolingualtext',
  quantity: 'quantity',
  globecoordinate: 'globecoordinate',
  wikibaseproperty: 'entity',
  url: 'string',
  commonsmedia: 'string'
}

const allDashesPattern = /-/g

module.exports = datatype => {
  const normalizedDatype = datatype.toLowerCase().replace(allDashesPattern, '')
  return buildersByNormalizedDatatypes[normalizedDatype]
}
