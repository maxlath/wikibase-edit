import type { PropertiesDatatypes } from '../../src/lib/properties/fetch_properties_datatypes'

export const randomString = () => Math.random().toString(36).slice(2, 10)
export const randomNumber = (length = 5) => Math.trunc(Math.random() * Math.pow(10, length))

export const someEntityId = 'Q1'
export const guid = 'Q1$3A8AA34F-0DEF-4803-AA8E-39D9EFD4DEAF'
export const guid2 = 'Q1$3A8AA34F-0DAB-4803-AA8E-39D9EFD4DEAF'
export const hash = '3d22f4dffba1ac6f66f521ea6bea924e46df4129'
export const sandboxStringProp = 'P1'

export const properties: PropertiesDatatypes = {
  P1: 'string',
  P2: 'wikibase-item',
  P3: 'wikibase-property',
  P4: 'time',
  P5: 'external-id',
  P6: 'globe-coordinate',
  P7: 'url',
  P8: 'quantity',
  P9: 'monolingualtext',
}

export function assert (condition: boolean): asserts condition {
  if (!condition) throw new Error('not true')
}
