const { validateAndEnrichConfig, validateParams } = require('./wrappers_utils')

module.exports = (fnModulePath, initConfig, API) => {
  const fn = require(`./${fnModulePath}`)(API, initConfig)
  return (params, config) => {
    return fn(params, config)
  }
}
