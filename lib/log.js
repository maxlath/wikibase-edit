const chalk = require('chalk')
var API
const { inspect } = require('util')
const infinitDepth = { depth: null, maxArrayLength: null }
const topSeparator = chalk.grey('*******')
const bottomSeparator = chalk.grey('----------------')

module.exports = config => {
  // Generate the functions only once
  if (API) return API

  var verbosity
  if (config.verbose === true) {
    verbosity = 2
  } else if (config.verbose === false) {
    verbosity = 0
  } else {
    if (typeof config.verbose !== 'number') throw new Error('invalid verbose config')
    verbosity = config.verbose
  }

  const log = (label, obj, color = 'green', level = 2) => {
    if (level <= verbosity) {
      console.log(`${topSeparator} ${chalk[color](label)} ${topSeparator}`)
      console.log(inspect(obj, infinitDepth))
      console.log(bottomSeparator)
    }
    return obj
  }
  API = {
    log,
    logError: (label, err) => log(label, err, 'red', 1),
    Log: label => obj => log(label, obj, 'green', 2),
    LogError: label => err => {
      API.logError(label, err)
      throw err
    }
  }
  return API
}
