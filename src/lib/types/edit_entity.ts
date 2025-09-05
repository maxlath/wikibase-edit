import type { OverrideProperties } from 'type-fest'
import type { Claim, CustomSimplifiedSnak, Guid, Hash, Item, LanguageRecord, Lexeme, MediaInfo, Property, PropertyId, Rank, SimplifiedClaim, SimplifiedItem, SimplifiedLexeme, SimplifiedMediaInfo, SimplifiedProperty, SimplifiedPropertyQualifiers, SimplifiedPropertySnaks, SimplifiedQualifier, SimplifiedReference, SimplifiedReferenceSnak, SimplifiedSnak, SimplifiedTerm } from 'wikibase-sdk'

export type LooseCustomSimplifiedClaim = CustomSimplifiedSnak & {
  id?: Guid
  rank?: Rank
  qualifiers?: LooseSimplifiedQualifiers
  references?: LooseSimplifiedReferences
}

type RemovableSimplifiedClaim = SimplifiedClaim & { remove?: boolean }
type RemovableSimplifiedPropertyClaims = RemovableSimplifiedClaim[]

export type LooseSimplifiedClaims = Record<PropertyId, RemovableSimplifiedPropertyClaims | RemovableSimplifiedClaim>
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

type EditableClaim = Partial<Claim> & { id: Claim['id'], remove?: boolean }

interface EditableEntityExtras {
  baserevid?: number
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
