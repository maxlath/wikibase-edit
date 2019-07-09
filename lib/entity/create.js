const edit = require('./edit')

module.exports = (params, properties) => {
  params.create = true
  return edit(params, properties)
}
