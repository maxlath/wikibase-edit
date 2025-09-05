import { simplifySnak, type Claim, type Datatype, type PropertyId, type Snak, type SnakWithValue, type StringSnakDataValue } from 'wikibase-sdk'
import { newError } from '../error.js'
import { parseQuantity } from './quantity.js'
import type { AbsoluteUrl } from '../types/common.js'

const issuesUrl = 'https://github.com/maxlath/wikibase-edit/issues'

interface PropertiesDatatypesDontMatchParams {
  movedSnaks: Snak[] | Claim[]
  originDatatype: Datatype
  targetDatatype: Datatype
  instance: AbsoluteUrl
  failingSnak?: Snak
  // For error context
  originPropertyId?: PropertyId
  targetPropertyId?: PropertyId
}

export function propertiesDatatypesDontMatch (params: PropertiesDatatypesDontMatchParams) {
  const { movedSnaks, originDatatype, targetDatatype, instance } = params
  const typeConverterKey = `${originDatatype}->${targetDatatype}`
  const convertType = snakTypeConversions[typeConverterKey]
  if (convertType) {
    for (let snak of movedSnaks) {
      snak = 'mainsnak' in snak ? snak.mainsnak : snak
      if (snakHasValue(snak)) {
        try {
          convertType(snak, instance)
        } catch (err) {
          const errMessage = `properties datatype don't match and ${typeConverterKey} type conversion failed: ${err.message}`
          params.failingSnak = snak
          const customErr = newError(errMessage, 400, params)
          customErr.cause = err
          throw customErr
        }
      }
    }
  } else {
    const errMessage = `properties datatype don't match
    No ${typeConverterKey} type converter found
    If you think that should be possible, please open a ticket:
    ${issuesUrl}/new?template=feature_request.md&title=${encodeURIComponent(`claim.move: add a ${typeConverterKey} type converter`)}&body=%20`
    throw newError(errMessage, 400, params)
  }
}

function simplifyToString (snak: SnakWithValue) {
  snak.datavalue.value = simplifySnak(snak, {}).toString()
  snak.datatype = snak.datavalue.type = 'string'
}

const snakTypeConversions = {
  'string->external-id': (snak: SnakWithValue) => {
    snak.datatype = 'string'
  },
  'string->quantity': (snak: SnakWithValue, instance: AbsoluteUrl) => {
    const { value } = snak.datavalue as StringSnakDataValue
    snak.datavalue.value = parseQuantity(value, instance)
    snak.datatype = snak.datavalue.type = 'quantity'
  },
  'external-id->string': simplifyToString,
  'monolingualtext->string': simplifyToString,
  'quantity->string': simplifyToString,
}

const snakHasValue = (snak: Snak) => snak.snaktype === 'value'
