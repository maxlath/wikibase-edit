const chalk = require('chalk')
var API
const { inspect } = require('util')
const infinitDepth = { depth: null, maxArrayLength: null }
const topSeparator = chalk.grey('*******')
const bottomSeparator = chalk.grey('----------------')

module.exports = config => {
  // Generate the functions only once
  if (API) return API

  const { verbose } = config
  const log = (label, obj, color = 'green') => {
    if (verbose) {
      console.log(`${topSeparator} ${chalk[color](label)} ${topSeparator}`)
      console.log(inspect(obj, infinitDepth))
      console.log(bottomSeparator)
    }
    return obj
  }
  API = {
    log,
    logError: (label, err) => log(label, err, 'red'),
    Log: label => obj => log(label, obj),
    LogError: label => err => {
      log(label, err, 'red')
      throw err
    }
  }
  return API
}
