const error_ = require('./error')
const fetchUsedPropertiesDatatypes = require('./properties/fetch_used_properties_datatypes')
const { validateAndEnrichConfig, validateParams } = require('./wrappers_utils')

module.exports = (fnModulePath, initConfig) => {
  const fn = require(`./${fnModulePath}`)
  return (params, config) => {
    config = validateAndEnrichConfig(initConfig, config)
    validateParams(params)

    const { post } = require('./request/request')(config)
    return fetchUsedPropertiesDatatypes(params, config)
    .then(() => {
      if (!config.properties) throw error_.new('properties not found', config)
      const { action, data } = fn(params, config.properties, config.instance)
      return post(action, data, config)
    })
  }
}
