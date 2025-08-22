import { snakPostData, type SnakPostDataParams } from '../claim/snak_post_data.js'
import * as validate from '../validate.js'

export function setQualifier (params, properties, instance) {
  const { guid, hash, property, value } = params

  validate.guid(guid)
  validate.property(property)
  const datatype = properties[property]
  validate.snakValue(property, datatype, value)

  const data: SnakPostDataParams['data'] = {
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
