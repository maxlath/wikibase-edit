const error_ = module.exports = {
  new: (message, statusCode, ...context) => {
    const err = new Error(message)
    err.statusCode = statusCode
    if (context) {
      if (context.length === 1) context = context[0]
      err.context = context
      err.rawStack = err.stack
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
