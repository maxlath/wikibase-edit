const buildersByNormalizedDatatypes = {
  commonsmedia: 'string',
  externalid: 'string',
  globecoordinate: 'globecoordinate',
  monolingualtext: 'monolingualtext',
  quantity: 'quantity',
  string: 'string',
  time: 'time',
  url: 'string',
  wikibaseitem: 'entity',
  wikibaseproperty: 'entity',
}

const allDashesPattern = /-/g

module.exports = datatype => {
  const normalizedDatype = datatype.toLowerCase().replace(allDashesPattern, '')
  return buildersByNormalizedDatatypes[normalizedDatype]
}
