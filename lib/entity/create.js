module.exports = config => {
  const edit = require('./edit')(config)
  return data => {
    data.create = true
    return edit(data)
  }
}
