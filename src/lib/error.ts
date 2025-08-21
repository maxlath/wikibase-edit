const error_ = {
  new: (message, statusCode, context) => {
    const err = new Error(message)
    if (typeof statusCode !== 'number') {
      if (context == null) {
        context = statusCode
        statusCode = 400
      } else {
        throw error_.new('invalid error status code', 500, { message, statusCode, context })
      }
    }
    err.statusCode = statusCode
    if (context) {
      context = convertSetsIntoArrays(context)
      err.context = context
      err.stack += `\n[context] ${JSON.stringify(context)}`
    }
    return err
  },
}

export default error_

const convertSetsIntoArrays = context => {
  const convertedContext = {}
  for (const key in context) {
    const value = context[key]
    convertedContext[key] = value instanceof Set ? Array.from(value) : value
  }
  return convertedContext
}
