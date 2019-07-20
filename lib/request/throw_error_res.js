const error_ = require('../error')

module.exports = label => body => {
  if (body.error) {
    const errMessage = label + ': ' + body.error.info
    const err = error_.new(errMessage, { body })
    err.body = body
    throw err
  }
  return body
}
