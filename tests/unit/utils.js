export const randomString = () => Math.random().toString(36).slice(2, 10)
export const randomNumber = (length = 5) => Math.trunc(Math.random() * Math.pow(10, length))

export const someEntityId = 'Q1'
export const guid = 'Q1$3A8AA34F-0DEF-4803-AA8E-39D9EFD4DEAF'
export const guid2 = 'Q1$3A8AA34F-0DAB-4803-AA8E-39D9EFD4DEAF'
export const hash = '3d22f4dffba1ac6f66f521ea6bea924e46df4129'
export const sandboxStringProp = 'P1'

export const properties = {
  P1: 'String',
  P2: 'WikibaseItem',
  P3: 'WikibaseProperty',
  P4: 'Time',
  P5: 'ExternalId',
  P6: 'GlobeCoordinate',
  P7: 'Url',
  P8: 'Quantity',
  P9: 'Monolingualtext',
}
