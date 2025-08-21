import snakPostData from '../claim/snak_post_data.js'
import * as validate from '../validate.js'

export default (params, properties, instance) => {
  const { guid, hash, property, value } = params

  validate.guid(guid)
  validate.property(property)
  const datatype = properties[property]
  validate.snakValue(property, datatype, value)

  const data = {
    claim: guid,
    property,
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
    instance,
  })
}
