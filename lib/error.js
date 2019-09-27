const error_ = module.exports = {
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
      err.context = context
      err.stack += `\n[context] ${JSON.stringify(context)}`
    }
    return err
  },
  // not using an arrow function as it messes with arguments
  reject: function () {
    const err = error_.new.apply(null, arguments)
    return Promise.reject(err)
  }
}
