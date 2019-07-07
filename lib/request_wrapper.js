const findDatatype = require('./properties/find_datatype')

module.exports = fnModulePath => {
  const fn = require(`./${fnModulePath}`)
  return (config, params) => {
    if (config == null) throw new Error(`missing config object`)
    if (params == null) throw new Error(`missing parameters object`)
    const { post } = require('./request')(config)

    console.log('params.property', params.property)
    if (params.property) {
      params.datatype = findDatatype(params.property)
      console.log('params.datatype', params.datatype)
    }

    const { action, data } = fn(params)
    console.log({ action, data: JSON.stringify(data) })
    return post(action, data)
  }
}
