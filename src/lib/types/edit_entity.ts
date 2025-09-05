import type { BaseRevId } from './common.js'
import type { Reconciliation } from '../entity/validate_reconciliation_object.js'
import type { OverrideProperties } from 'type-fest'
import type { Claim, CustomSimplifiedClaim, CustomSimplifiedSnak, Guid, Hash, Item, LanguageRecord, Lexeme, MediaInfo, Property, PropertyId, Rank, SimplifiedItem, SimplifiedLexeme, SimplifiedMediaInfo, SimplifiedProperty, SimplifiedPropertyQualifiers, SimplifiedPropertySnaks, SimplifiedQualifier, SimplifiedReference, SimplifiedReferenceSnak, SimplifiedSnak, SimplifiedTerm, SnakDataValue } from 'wikibase-sdk'

export type LooseCustomSimplifiedClaim = CustomSimplifiedSnak & {
  id?: Guid
  rank?: Rank
  qualifiers?: LooseSimplifiedQualifiers
  references?: LooseSimplifiedReferences
}

export interface EditableClaimExtras {
  remove?: boolean
  reconciliation?: Reconciliation
}

export type EditableClaim = Partial<Claim> & EditableClaimExtras & {
  id: Claim['id']
}

export type CustomSimplifiedEditableClaim = Partial<CustomSimplifiedClaim> & EditableClaimExtras & {
  id: CustomSimplifiedClaim['id']
}

export type SimplifiedEditableClaim = string | number | (SnakDataValue['value'] & EditableClaimExtras) | CustomSimplifiedEditableClaim
export type SimplifiedEditablePropertyClaims = SimplifiedEditableClaim[]

export type LooseSimplifiedClaims = Record<PropertyId, SimplifiedEditablePropertyClaims | SimplifiedEditableClaim>
export type LooseSimplifiedSnaks = Record<PropertyId, SimplifiedPropertySnaks | SimplifiedSnak>

export type LooseSimplifiedQualifiers = Record<string, SimplifiedPropertyQualifiers | SimplifiedQualifier>

export type LooseSimplifiedReferenceSnaks = Record<PropertyId, SimplifiedReferenceSnak | SimplifiedReferenceSnak[]>

export interface LooseRichSimplifiedReferenceSnaks {
  snaks: LooseSimplifiedReferenceSnaks
  hash: Hash
}

export type LooseSimplifiedReference = SimplifiedReference | LooseSimplifiedReferenceSnaks | LooseRichSimplifiedReferenceSnaks

export type LooseSimplifiedReferences = SimplifiedReference[] | LooseSimplifiedReference[] | LooseSimplifiedReference

export type LooseSimplifiedClaim = string | number | LooseCustomSimplifiedClaim

export type LooseSimplifiedItem = OverrideProperties<SimplifiedItem, {
  aliases?: LooseSimplifiedAliases
  claims?: LooseSimplifiedClaims
}>

export type LooseSimplifiedProperty = OverrideProperties<SimplifiedProperty, {
  aliases?: LooseSimplifiedAliases
  claims?: LooseSimplifiedClaims
}>

export type LooseSimplifiedLexeme = OverrideProperties<SimplifiedLexeme, {
  claims?: LooseSimplifiedClaims
}>

export type LooseSimplifiedMediaInfo = OverrideProperties<SimplifiedMediaInfo, {
  statements?: LooseSimplifiedClaims
}>

export type LooseSimplifiedEntity = LooseSimplifiedProperty | LooseSimplifiedItem | LooseSimplifiedLexeme | LooseSimplifiedMediaInfo

export type LooseSimplifiedAliases = LanguageRecord<readonly SimplifiedTerm[] | SimplifiedTerm>

interface EditableEntityExtras {
  baserevid?: BaseRevId
}

/** See https://www.wikidata.org/w/api.php?action=help&modules=wbeditentity */
export type EditableItem = OverrideProperties<Item, {
  claims?: EditableClaim[]
}> & EditableEntityExtras
export type EditableProperty = OverrideProperties<Property, {
  claims?: EditableClaim[]
}> & EditableEntityExtras
export type EditableLexeme = OverrideProperties<Lexeme, {
  claims?: EditableClaim[]
}> & EditableEntityExtras
/** See https://commons.wikimedia.org/w/api.php?action=help&modules=wbeditentity */
export type EditableMediaInfo = Omit<MediaInfo, 'statements'> & {
  claims?: EditableClaim[]
} & EditableEntityExtras

export type EditableEntity = (EditableItem | EditableProperty | EditableLexeme | EditableMediaInfo) & EditableEntityExtras

export type SimplifiedEditableEntity = (LooseSimplifiedItem | LooseSimplifiedProperty | LooseSimplifiedLexeme | LooseSimplifiedMediaInfo) & EditableEntityExtras
