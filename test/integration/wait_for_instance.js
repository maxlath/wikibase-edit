const { instance } = require('config')
const breq = require('bluereq')
const { yellow, grey } = require('chalk')
const { delay } = require('./utils')

module.exports = () => {
  const wait = () => {
    return breq.get(instance)
    .timeout(2000)
    .catch(err => {
      console.warn(yellow(`waiting for instance at ${instance}`, grey(err.code)))
      return delay(1000).then(wait)
    })
  }

  return wait()
}
