const _ = require('../utils')
const validate = require('../validate')
const snakPostData = require('../claim/snak_post_data')

module.exports = (params, properties) => {
  const { guid, property, value } = params

  validate.guid(guid)
  validate.property(property)
  const datatype = properties[property]
  validate.qualifierValue(property, datatype, value)

  return snakPostData({
    action: 'wbsetqualifier',
    data: { claim: guid, property },
    datatype,
    value
  })
}
