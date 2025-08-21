import { isPropertyId } from 'wikibase-sdk'
import { newError } from '../error.js'

export default (reconciliation, claim) => {
  if (typeof reconciliation !== 'object') throw newError('reconciliation should be an object', { reconciliation })
  for (const key of Object.keys(reconciliation)) {
    if (!validReconciliationKeys.includes(key)) {
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

const validateMatchingPropertyArray = (name, array) => {
  if (array) {
    if (!(array instanceof Array)) {
      throw newError(`invalid ${name} array`, { [name]: array })
    }
    for (const id of array) {
      const [ pid, option ] = id.split(':')
      if (!isPropertyId(pid)) {
        throw newError(`invalid ${name} property id`, { property: pid })
      }
      if (option && !validOptions.includes(option)) {
        throw newError(`invalid ${name} property id option: ${option}`, { id, pid, option })
      }
    }
  }
}

const validReconciliationKeys = [ 'mode', 'matchingQualifiers', 'matchingReferences' ]
const validReconciliationModes = [ 'skip-on-value-match', 'skip-on-any-value', 'merge' ]
const validOptions = [ 'all', 'any' ]
