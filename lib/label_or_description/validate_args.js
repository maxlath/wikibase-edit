const validate = require('../validate')
const error_ = require('../error')

module.exports = (entity, language, name, value) => {
  try {
    validate.entity(entity)
    validate.language(language)
    if (value == null) throw error_.new(`missing ${name}`, { entity, language, name })
    validate.labelOrDescription(name, value)
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}
