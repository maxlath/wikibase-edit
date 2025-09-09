import type { GlobeCoordinateSnakDataValue, MonolingualTextSnakDataValue, StringSnakDataValue, TimeSnakDataValue, WikibaseEntityIdSnakDataValue } from 'wikibase-sdk'

type CustomEditableGlobeCoordinateSnakValue = Pick<GlobeCoordinateSnakDataValue['value'], 'latitude' | 'longitude'> & Partial<Omit<GlobeCoordinateSnakDataValue['value'], 'latitude' | 'longitude'>>
type EditableGlobeCoordinateSnakValue = [ number, number ] | CustomEditableGlobeCoordinateSnakValue

type EditableMonolingualTextSnakValue = MonolingualTextSnakDataValue['value']

interface CustomQuantitySnakDataValue {
  amount: number | string
  unit?: string
  upperBound?: number | string
  lowerBound?: number | string
}
type EditableQuantitySnakValue = number | CustomQuantitySnakDataValue

type EditableStringSnakValue = StringSnakDataValue['value']

type CustomEditableTimeSnakValue = { time: string } & Partial<Omit<TimeSnakDataValue['value'], 'time'>>
type EditableTimeSnakValue = string | CustomEditableTimeSnakValue

type EditableWikibaseEntityIdSnakValue = WikibaseEntityIdSnakDataValue['value']

export type EditableSnakValue = EditableGlobeCoordinateSnakValue | EditableMonolingualTextSnakValue | EditableQuantitySnakValue | EditableStringSnakValue | EditableTimeSnakValue | EditableWikibaseEntityIdSnakValue
