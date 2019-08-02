module.exports = config => {
  const edit = require('./../entity/edit')(config)
  return data => {
    data.id = 'create';
    data.type = 'property';
    return edit(data)
  }
}
