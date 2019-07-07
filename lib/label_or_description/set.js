const validate = require('../validate')

module.exports = name => params => {
  const { id, language, value } = params
  const action = `wbset${name}`

  validate.entity(id)
  validate.language(language)
  if (value == null) throw new Error(`missing ${name}`)
  validate.labelOrDescription(name, value)

  return {
    action,
    data: { id, language, value }
  }
}
