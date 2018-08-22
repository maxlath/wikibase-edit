module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return claim => post('wbsetclaim', { claim: JSON.stringify(claim), format: 'json' })
  .then(Log(`set claim res (${claim.id})`))
  .catch(LogError(`set claim err (${claim.id})`))
}
