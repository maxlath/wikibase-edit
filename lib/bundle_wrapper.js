const fetchUsedPropertiesDatatypes = require('./properties/fetch_used_properties_datatypes')
const validateAndEnrichConfig = require('./validate_and_enrich_config')

module.exports = (fn, generalConfig) => async (params, reqConfig) => {
  const config = validateAndEnrichConfig(generalConfig, reqConfig)
  await fetchUsedPropertiesDatatypes(params, config)
  return fn(params, reqConfig)
}
