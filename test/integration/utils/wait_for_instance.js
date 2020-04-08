const { __, instance } = require('config')
const fetch = require('cross-fetch')
const { yellow, grey } = require('chalk')
const { delay } = __.require('test/integration/utils/utils')

module.exports = () => {
  const wait = async () => {
    return fetch(instance, { timeout: 2000 })
    .catch(err => {
      console.warn(yellow(`waiting for instance at ${instance}`, grey(err.code)))
      return delay(1000).then(wait)
    })
  }

  return wait()
}
