const validate = require('../validate')
const error_ = require('../error')

module.exports = name => params => {
  const { id, language, value } = params
  const action = `wbset${name}`

  validate.entity(id)
  validate.language(language)
  if (value == null) throw error_.new(`missing ${name}`, params)
  validate.labelOrDescription(name, value)

  return {
    action,
    data: { id, language, value }
  }
}
