import { newError } from '../error.js'
import { hasSpecialSnaktype, type SpecialSnak } from './special_snaktype.js'
import type { Reconciliation } from '../entity/validate_reconciliation_object.js'
import type { WikibaseEditAPI } from '../index.js'
import type { BaseRevId } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { RawEditableEntity, CustomSimplifiedEditableClaim, SimplifiedEditableQualifiers, SimplifiedEditableReferences } from '../types/edit_entity.js'
import type { EditableSnakValue } from '../types/snaks.js'
import type { Claim, PropertyId, Rank } from 'wikibase-sdk'

export interface CreateClaimParams {
  id: RawEditableEntity['id']
  property: PropertyId
  value: EditableSnakValue | SpecialSnak
  qualifiers?: SimplifiedEditableQualifiers
  references?: SimplifiedEditableReferences
  rank?: Rank
  reconciliation?: Reconciliation
  summary?: string
  baserevid?: BaseRevId
}

export async function createClaim (params: CreateClaimParams, config: SerializedConfig, API: WikibaseEditAPI) {
  const { id, property, value, qualifiers, references, rank, reconciliation } = params
  const { statementsKey } = config

  if (value == null) throw newError('missing value', 400, params)

  const claim: Partial<CustomSimplifiedEditableClaim> = { rank, qualifiers, references }
  if (hasSpecialSnaktype(value)) {
    claim.snaktype = value.snaktype
  } else {
    claim.value = value
  }

  let summary = params.summary || config.summary

  if (!summary) {
    const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value)
    summary = `add ${property} claim: ${stringifiedValue}`
  }

  const data = {
    id,
    [statementsKey]: {
      [property]: claim,
    },
    summary,
    baserevid: params.baserevid || config.baserevid,
    reconciliation,
  }

  // Using wbeditentity, as the endpoint is more complete
  // @ts-expect-error
  const { entity, success } = await API.entity.edit(data, config)

  const newClaim: Claim = entity[statementsKey][property].slice(-1)[0]
  // Mimick claim actions responses
  return { claim: newClaim, success }
}

export interface CreateClaimResponse {
  claim: Claim
  success: 1
}
