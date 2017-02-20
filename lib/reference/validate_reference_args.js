const wdk = require('wikidata-sdk')
const error_ = require('../error')
const _ = require('../utils')

module.exports = (guid, reference) => {
  if ((!_.isNonEmptyString(guid))) {
    return error_.reject('missing guid', 400, guid)
  }

  const [ entity, rest ] = guid.split('$')
  if (!wdk.isWikidataEntityId(entity)) {
    return error_.reject('invalid guid', 400, guid)
  }

  if (!(_.isNonEmptyString(rest) && /[\w-]{36}/.test(rest))) {
    return error_.reject('invalid guid', 400, guid)
  }

  if ((!_.isNonEmptyString(reference))) {
    return error_.reject('missing reference', 400, reference)
  }

  if ((!(reference.startsWith('http') || wdk.isWikidataEntityId(reference)))) {
    return error_.reject('invalid reference', 400, reference)
  }

  return Promise.resolve()
}
