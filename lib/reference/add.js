const _ = require('../utils')
const validate = require('../validate')
const snak = require('../claim/snak')

module.exports = params => {
  const { guid, property, value } = params
  validate.guid(guid)
  validate.property(property)
  validate.referenceValue(property, value)

  const snaks = {}
  snaks[property] = [ snak(property, value) ]

  return {
    action: 'wbsetreference',
    data: {
      statement: guid,
      snaks: JSON.stringify(snaks)
    }
  }
}
