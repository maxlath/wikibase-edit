import * as validate from '../validate.js'

export default action => params => {
  const { id, language, value } = params

  validate.entity(id)
  validate.language(language)
  validate.aliases(value)

  const data = { id, language }

  data[action] = value instanceof Array ? value.join('|') : value

  return { action: 'wbsetaliases', data }
}
