const fetchPropertiesDatatypes = require('./properties/fetch_properties_datatypes')

module.exports = fnModulePath => {
  const fn = require(`./${fnModulePath}`)
  return (config, params) => {
    if (config == null) throw new Error(`missing config object`)
    if (params == null) throw new Error(`missing parameters object`)
    const { post } = require('./request')(config)
    return fetchUsedPropertiesDatatypes(config, params)
    .then(() => {
      const { action, data } = fn(params, config.properties)
      console.log({ action, data: JSON.stringify(data) })
      return post(action, data)
    })
  }
}

const fetchUsedPropertiesDatatypes = (config, params) => {
  const propertyIds = []
  if (params.property) propertyIds.push(params.property)
  return fetchPropertiesDatatypes(config, propertyIds)
}
