const error_ = require('../error')
const { simplify } = require('wikibase-sdk')
const { parseQuantity } = require('./quantity')
const issuesUrl = require('../../package.json').bugs.url

const propertiesDatatypesDontMatch = ({ movedSnaks, originDatatype, originPropertyId, targetDatatype, targetPropertyId }) => {
  const typeConverterKey = `${originDatatype}->${targetDatatype}`
  const convertType = snakTypeConversions[typeConverterKey]
  if (convertType) {
    for (let snak of movedSnaks) {
      snak = snak.mainsnak || snak
      if (snakHasValue(snak)) {
        try {
          convertType(snak)
        } catch (err) {
          const errMessage = `properties datatype don't match and ${typeConverterKey} type conversion failed: ${err.message}`
          throw error_.new(errMessage, 400, { snak, typeConverterKey, originPropertyId, targetPropertyId })
        }
      }
    }
  } else {
    const errMessage = `properties datatype don't match
    No ${typeConverterKey} type converter found
    If you think that should be possible, please open a ticket:
    ${issuesUrl}/new?template=feature_request.md&title=${encodeURIComponent(`claim.move: add a ${typeConverterKey} type converter`)}&body=%20`
    throw error_.new(errMessage, 400, { movedSnaks, typeConverterKey, originPropertyId, targetPropertyId })
  }
}

const simplifyToString = snak => {
  snak.datavalue.value = simplify.snak(snak).toString()
  snak.datatype = snak.datavalue.type = 'string'
}

const snakTypeConversions = {
  'string->external-id': snak => {
    snak.datatype = 'string'
  },
  'string->quantity': snak => {
    const { value } = snak.datavalue
    snak.datavalue.value = parseQuantity(value)
    snak.datatype = snak.datavalue.type = 'quantity'
  },
  'external-id->string': simplifyToString,
  'monolingualtext->string': simplifyToString,
  'quantity->string': simplifyToString,
}

const snakHasValue = snak => snak.snaktype === 'value'

module.exports = { propertiesDatatypesDontMatch }
