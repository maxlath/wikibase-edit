const getBuilder = require('./get_builder')
const { hasSpecialSnaktype } = require('./special_snaktype')

module.exports = params => {
  const { post, action, data, value } = params

  if (hasSpecialSnaktype(value)) {
    data.snaktype = value.snaktype
  } else {
    const { property } = data
    data.snaktype = 'value'
    data.value = getBuilder(property)(value)
  }

  return post(action, data)
}
