const { instance } = require('config')
const fetch = require('lib/request/fetch')
const { yellow, grey } = require('chalk')
const { wait } = require('test/integration/utils/utils')

module.exports = () => {
  const check = async () => {
    return fetch(instance, { timeout: 2000 })
    .catch(err => {
      console.warn(yellow(`waiting for instance at ${instance}`, grey(err.code)))
      return wait(1000).then(check)
    })
  }

  return check()
}
