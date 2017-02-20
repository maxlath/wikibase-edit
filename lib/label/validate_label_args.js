const validate = require('../validate')

module.exports = (entity, language, label) => {
  try {
    validate.entity(entity)
    validate.language(language)
    validate.label(label)
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}
