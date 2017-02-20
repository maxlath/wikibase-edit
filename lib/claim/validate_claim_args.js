const validate = require('../validate')

module.exports = (entity, property, value) => {
  try {
    validate.entity(entity)
    validate.property(property)
    validate.claimValue(property, value)
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}
