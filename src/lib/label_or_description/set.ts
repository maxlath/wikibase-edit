import { newError } from '../error.js'
import * as validate from '../validate.js'

export default name => params => {
  const { id, language } = params
  let { value } = params
  const action = `wbset${name}`

  validate.entity(id)
  validate.language(language)
  if (value === undefined) throw newError(`missing ${name}`, params)
  if (value === null) value = ''

  return {
    action,
    data: { id, language, value },
  }
}
