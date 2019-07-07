const edit = require('./edit')

module.exports = params => {
  params.create = true
  return edit(params)
}
