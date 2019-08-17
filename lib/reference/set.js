const validate = require('../validate')
const snak = require('../claim/snak')

module.exports = (params, properties) => {
  const { guid, property, value } = params
  validate.guid(guid)
  validate.property(property)
  const datatype = properties[property]
  validate.snakValue(property, datatype, value)

  const snaks = {}
  snaks[property] = [ snak(property, datatype, value) ]

  return {
    action: 'wbsetreference',
    data: {
      statement: guid,
      snaks: JSON.stringify(snaks)
    }
  }
}
