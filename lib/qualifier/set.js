const validate = require('../validate')
const snakPostData = require('../claim/snak_post_data')

module.exports = (params, properties, instance) => {
  const { guid, hash, property, value } = params

  validate.guid(guid)
  validate.property(property)
  const datatype = properties[property]
  validate.snakValue(property, datatype, value)

  const data = {
    claim: guid,
    property
  }

  if (hash != null) {
    validate.hash(hash)
    data.snakhash = hash
  }

  return snakPostData({
    action: 'wbsetqualifier',
    data,
    datatype,
    value,
    instance
  })
}
