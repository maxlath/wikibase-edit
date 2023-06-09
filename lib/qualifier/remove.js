import _ from '../utils.js'
import validate from '../validate.js'

export default params => {
  let { guid, hash } = params
  validate.guid(guid)

  if (_.isArray(hash)) {
    hash.forEach(validate.hash)
    hash = hash.join('|')
  } else {
    validate.hash(hash)
  }

  return {
    action: 'wbremovequalifiers',
    data: {
      claim: guid,
      qualifiers: hash,
    },
  }
}
