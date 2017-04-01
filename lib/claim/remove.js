const { forceArray } = require('../utils')

module.exports = (config) => {
  const { post } = require('../request')(config)
  return (guids) => {
    if (!guids) throw new Error('missing guids')
    return post('wbremoveclaims', { claim: forceArray(guids).join('|') })
  }
}
