import type { Datatype } from 'wikibase-sdk'

const buildersByNormalizedDatatypes = {
  commonsmedia: 'string',
  edtf: 'string',
  externalid: 'string',
  globecoordinate: 'globecoordinate',
  geoshape: 'string',
  // datatype from https://github.com/ProfessionalWiki/WikibaseLocalMedia
  localmedia: 'string',
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
} as const

const allDashesPattern = /-/g

export function normalizeDatatype (datatype: string) {
  const normalizedDatype = datatype.toLowerCase().replace(allDashesPattern, '')
  return buildersByNormalizedDatatypes[normalizedDatype] as Datatype
}
