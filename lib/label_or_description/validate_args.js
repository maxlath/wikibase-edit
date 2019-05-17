const validate = require('../validate')

module.exports = (entity, language, name, value) => {
  try {
    validate.entity(entity)
    validate.language(language)
    if (value == null) throw new Error(`missing ${name}`)
    validate.labelOrDescription(name, value)
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}
