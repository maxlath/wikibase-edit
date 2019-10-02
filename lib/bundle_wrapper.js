const fetchUsedPropertiesDatatypes = require('./properties/fetch_used_properties_datatypes')
const validateAndEnrichConfig = require('./validate_and_enrich_config')

module.exports = (fnModulePath, generalConfig, API) => {
  const fn = require(`./${fnModulePath}`)(API, generalConfig)

  return (params, reqConfig) => {
    const config = validateAndEnrichConfig(generalConfig, reqConfig)

    return fetchUsedPropertiesDatatypes(params, config)
    .then(() => fn(params, reqConfig))
  }
}
