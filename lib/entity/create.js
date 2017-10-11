module.exports = config => {
  const edit = require('./edit')(config)
  return data => {
    data.id = 'create'
    return edit(data)
  }
}
