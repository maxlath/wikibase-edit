import { isPropertyId, type PropertyId } from 'wikibase-sdk'
import { newError } from '../error.js'
import { arrayIncludes } from '../utils.js'

const validReconciliationKeys = [ 'mode', 'matchingQualifiers', 'matchingReferences' ] as const
const validReconciliationModes = [ 'skip-on-value-match', 'skip-on-any-value', 'merge' ] as const
const validOptions = [ 'all', 'any' ] as const

export type ReconciliationMode = typeof validReconciliationModes[number]

type ReconciliationKeyOption = typeof validOptions[number]
type ReconciliationKey = PropertyId | `${PropertyId}:${ReconciliationKeyOption}`

/**
 * See https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#reconciliation
 */
export interface Reconciliation {
  mode?: ReconciliationMode
  matchingQualifiers?: ReconciliationKey[]
  matchingReferences?: ReconciliationKey[]
}

export function validateReconciliationObject (reconciliation: Reconciliation, claim) {
  if (typeof reconciliation !== 'object') throw newError('reconciliation should be an object', { reconciliation })
  for (const key of Object.keys(reconciliation)) {
    if (!arrayIncludes(validReconciliationKeys, key)) {
      throw newError('invalid reconciliation object key', { key, reconciliation, validReconciliationKeys })
    }
  }
  const { mode, matchingQualifiers, matchingReferences } = reconciliation
  if (!claim.remove && !validReconciliationModes.includes(mode)) {
    throw newError('invalid reconciliation mode', { mode, validReconciliationModes })
  }

  validateMatchingPropertyArray('matchingQualifiers', matchingQualifiers)
  validateMatchingPropertyArray('matchingReferences', matchingReferences)
}

function validateMatchingPropertyArray (name: string, array: ReconciliationKey[]) {
  if (array) {
    if (!(array instanceof Array)) {
      throw newError(`invalid ${name} array`, { [name]: array })
    }
    for (const id of array) {
      const [ pid, option ] = id.split(':')
      if (!isPropertyId(pid)) {
        throw newError(`invalid ${name} property id`, { property: pid })
      }
      if (option && !arrayIncludes(validOptions, option)) {
        throw newError(`invalid ${name} property id option: ${option}`, { id, pid, option })
      }
    }
  }
}
