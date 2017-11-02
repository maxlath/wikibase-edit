const _ = require('./utils')
const chalk = require('chalk')
const { inspect } = require('util')
const infinitDepth = { depth: null, maxArrayLength: null }
const topSeparator = chalk.grey('*******')
const bottomSeparator = chalk.grey('----------------')
var API

module.exports = config => {
  // Generate the functions only once
  if (API) return API

  var verbosity
  if (config.verbose === true) {
    verbosity = 2
  } else if (_.isNumber(config.verbose)) {
    verbosity = config.verbose
  } else {
    // Default to low verbosity
    verbosity = 0
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
