import type { CalendarAlias } from '#lib/claim/parse_calendar'
import type { SpecialSnak } from '#lib/claim/special_snaktype'
import type { GlobeCoordinateSnakDataValue, MonolingualTextSnakDataValue, StringSnakDataValue, TimeSnakDataValue, WikibaseEntityIdSnakDataValue } from 'wikibase-sdk'

export type CustomEditableGlobeCoordinateSnakValue = Pick<GlobeCoordinateSnakDataValue['value'], 'latitude' | 'longitude'> & Partial<Omit<GlobeCoordinateSnakDataValue['value'], 'latitude' | 'longitude'>>
export type EditableGlobeCoordinateSnakValue = [ number, number ] | CustomEditableGlobeCoordinateSnakValue

export type EditableMonolingualTextSnakValue = MonolingualTextSnakDataValue['value']

export interface CustomQuantitySnakDataValue {
  amount: number | string
  unit?: string
  upperBound?: number | string
  lowerBound?: number | string
}
export type EditableQuantitySnakValue = number | CustomQuantitySnakDataValue

export type EditableStringSnakValue = StringSnakDataValue['value']

export type CustomEditableTimeSnakValue = {
  time: string
  calendar?: CalendarAlias
} & Partial<Omit<TimeSnakDataValue['value'], 'time'>>
export type EditableTimeSnakValue = string | CustomEditableTimeSnakValue

export type EditableWikibaseEntityIdSnakValue = WikibaseEntityIdSnakDataValue['value']

export type EditableSnakValue = EditableGlobeCoordinateSnakValue | EditableMonolingualTextSnakValue | EditableQuantitySnakValue | EditableStringSnakValue | EditableTimeSnakValue | EditableWikibaseEntityIdSnakValue | SpecialSnak
