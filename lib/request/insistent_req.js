const breq = require('bluereq')

module.exports = (verb, params) => {
  return breq[verb](params)
  .timeout(30000)
  .catch(err => {
    // Retry once
    if (err.name === 'TimeoutError') return breq[verb](params)
    throw err
  })
}
