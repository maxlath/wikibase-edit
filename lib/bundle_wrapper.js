module.exports = (fnModulePath, generalConfig, API) => {
  const fn = require(`./${fnModulePath}`)(API, generalConfig)
  return (params, reqConfig) => {
    return fn(params, reqConfig)
  }
}
