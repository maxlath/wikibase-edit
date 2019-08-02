const edit = require('./edit')

module.exports = (params, properties, instance) => {
  params.create = true
  return edit(params, properties, instance)
}
