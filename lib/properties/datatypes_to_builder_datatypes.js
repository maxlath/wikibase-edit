const buildersByNormalizedDatatypes = {
  commonsmedia: 'string',
  externalid: 'string',
  globecoordinate: 'globecoordinate',
  geoshape: 'string',
  math: 'string',
  monolingualtext: 'monolingualtext',
  musicalnotation: 'string',
  quantity: 'quantity',
  string: 'string',
  tabulardata: 'string',
  time: 'time',
  url: 'string',
  wikibaseform: 'entity',
  wikibaseitem: 'entity',
  wikibaselexeme: 'entity',
  wikibaseproperty: 'entity',
  wikibasesense: 'entity',
}

const allDashesPattern = /-/g

module.exports = datatype => {
  const normalizedDatype = datatype.toLowerCase().replace(allDashesPattern, '')
  return buildersByNormalizedDatatypes[normalizedDatype]
}
