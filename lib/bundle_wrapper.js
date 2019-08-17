module.exports = (fnModulePath, generalConfig, API) => {
  const fn = require(`./${fnModulePath}`)(API, generalConfig)
  return (params, config) => {
    return fn(params, config)
  }
}
