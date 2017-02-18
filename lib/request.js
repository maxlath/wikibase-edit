const got = require('got')
const _ = require('./utils')

module.exports = {
  get: (url) => got.get(url, { json: true}).then(_.property('body'))
}
