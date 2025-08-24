import { newError } from '../error.js'
import type { Reconciliation } from '../entity/validate_reconciliation_object.js'
import type { WikibaseEditAPI } from '../index.js'
import type { SerializedConfig } from '../types/config.js'
import type { Claim, EntityId, PropertyId, Rank, SimplifiedClaim, SimplifiedQualifiers, SimplifiedReferences } from 'wikibase-sdk'

export interface CreateClaimParams {
  id: EntityId
  property: PropertyId
  value: SimplifiedClaim
  qualifiers?: SimplifiedQualifiers
  references?: SimplifiedReferences
  rank?: Rank
  reconciliation?: Reconciliation
}

export async function createClaim (params: CreateClaimParams, config: SerializedConfig, API: WikibaseEditAPI) {
  const { id, property, value, qualifiers, references, rank, reconciliation } = params
  const { statementsKey } = config

  if (value == null) throw newError('missing value', 400, params)

  const claim = { rank, qualifiers, references }
  if (value.snaktype && value.snaktype !== 'value') {
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

  // Using wbeditentity, as the endpoint is more complete, so we need to recover the summary
  const { entity, success } = await API.entity.edit(data, config)

  const newClaim = entity[statementsKey][property].slice(-1)[0]
  // Mimick claim actions responses
  return { claim: newClaim, success }
}

export interface CreateClaimResponse {
  claim: Claim
  success: 1
}
