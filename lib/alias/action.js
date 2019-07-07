const validate = require('../validate')

module.exports = action => params => {
  const { id, language, value } = params

  validate.entity(id)
  validate.language(language)
  validate.aliases(value)

  const data = { id, language }

  data[action] = value

  return { action: 'wbsetaliases', data }
}
