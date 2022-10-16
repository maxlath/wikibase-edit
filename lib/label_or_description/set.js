const validate = require('../validate')
const error_ = require('../error')

module.exports = name => params => {
  const { id, language } = params
  let { value } = params
  const action = `wbset${name}`

  validate.entity(id)
  validate.language(language)
  if (value === undefined) throw error_.new(`missing ${name}`, params)
  if (value === null) value = ''

  return {
    action,
    data: { id, language, value }
  }
}
