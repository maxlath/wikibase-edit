import type { BaseRevId } from './common.js'
import type { EditableSnakValue } from './snaks.js'
import type { Reconciliation } from '../entity/validate_reconciliation_object.js'
import type { OverrideProperties } from 'type-fest'
import type { Claim, Guid, Hash, Item, LanguageRecord, Lexeme, MediaInfo, Property, PropertyId, Rank, SimplifiedItem, SimplifiedLexeme, SimplifiedMediaInfo, SimplifiedProperty, SimplifiedReference, SimplifiedTerm, Site, SitelinkBadges, SitelinkTitle, SnakType } from 'wikibase-sdk'

export interface EditableClaimExtras {
  remove?: boolean
  reconciliation?: Reconciliation
}

export interface CustomSimplifiedEditableSnak {
  value: EditableSnakValue
  snaktype?: SnakType
  hash?: Hash
}

export type SimplifiedEditableSnak = string | number | CustomSimplifiedEditableSnak | EditableSnakValue
export type SimpifiedEditableQualifier = SimplifiedEditableSnak

export type SimplifiedEditablePropertySnaks = SimplifiedEditableSnak[]

export interface CustomSimplifiedEditableClaim extends EditableClaimExtras {
  id?: Guid
  value?: EditableSnakValue
  rank?: Rank
  qualifiers?: SimplifiedEditableQualifiers
  references?: SimplifiedEditableReferences
  snaktype?: SnakType
}

export type EditableClaim = Partial<Claim> & EditableClaimExtras & {
  id: Claim['id']
}

export type SimplifiedEditableClaim = string | number | (EditableSnakValue & EditableClaimExtras) | CustomSimplifiedEditableClaim
export type SimplifiedEditablePropertyClaims = SimplifiedEditableClaim[]

export type SimplifiedEditableClaims = Record<PropertyId, SimplifiedEditablePropertyClaims | SimplifiedEditableClaim>
export type SimplifiedEditableSnaks = Record<PropertyId, SimplifiedEditablePropertySnaks | SimplifiedEditableSnak>

export type SimplifiedEditableQualifiers = Record<string, SimplifiedEditableSnak[] | SimplifiedEditableSnak>

export type SimplifiedEditableReferenceSnaks = Record<PropertyId, SimplifiedEditableSnak | SimplifiedEditableSnak[]>

export interface SimplifiedEditableRichReferenceSnaks {
  snaks: SimplifiedEditableReferenceSnaks
  hash: Hash
}

export type SimplifiedEditableReference = EditableSnakValue | SimplifiedReference | SimplifiedEditableReferenceSnaks | SimplifiedEditableRichReferenceSnaks

export type SimplifiedEditableReferences = SimplifiedReference[] | SimplifiedEditableReference[] | SimplifiedEditableReference

export interface CustomSimplifiedEditableSitelinks {
  title?: SitelinkTitle
  remove?: boolean
  badges?: SitelinkBadges
  url?: string
}

export type SimplifiedEditableSitelinks = Record<Site, SitelinkTitle | CustomSimplifiedEditableSitelinks | null>

export type SimplifiedEditableItem = OverrideProperties<SimplifiedItem, {
  aliases?: SimplifiedEditableAliases
  claims?: SimplifiedEditableClaims
  sitelinks?: SimplifiedEditableSitelinks
}>

export type SimplifiedEditableProperty = OverrideProperties<SimplifiedProperty, {
  aliases?: SimplifiedEditableAliases
  claims?: SimplifiedEditableClaims
}>

export type SimplifiedEditableLexeme = OverrideProperties<SimplifiedLexeme, {
  claims?: SimplifiedEditableClaims
}>

export type SimplifiedEditableMediaInfo = OverrideProperties<SimplifiedMediaInfo, {
  statements?: SimplifiedEditableClaims
}>

export type SimplifiedEditableAliases = LanguageRecord<readonly SimplifiedTerm[] | SimplifiedTerm>

interface EditableEntityExtras {
  baserevid?: BaseRevId
}

/** See https://www.wikidata.org/w/api.php?action=help&modules=wbeditentity */
export type RawEditableItem = OverrideProperties<Item, {
  claims?: EditableClaim[]
}> & EditableEntityExtras
export type RawEditableProperty = OverrideProperties<Property, {
  claims?: EditableClaim[]
}> & EditableEntityExtras
export type RawEditableLexeme = OverrideProperties<Lexeme, {
  claims?: EditableClaim[]
}> & EditableEntityExtras
/** See https://commons.wikimedia.org/w/api.php?action=help&modules=wbeditentity */
export type RawEditableMediaInfo = Omit<MediaInfo, 'statements'> & {
  claims?: EditableClaim[]
} & EditableEntityExtras

/** An entity where claim.remove can be set */
export type RawEditableEntity = (RawEditableItem | RawEditableProperty | RawEditableLexeme | RawEditableMediaInfo) & EditableEntityExtras

export type SimplifiedEditableEntity = (SimplifiedEditableItem | SimplifiedEditableProperty | SimplifiedEditableLexeme | SimplifiedEditableMediaInfo) & EditableEntityExtras
