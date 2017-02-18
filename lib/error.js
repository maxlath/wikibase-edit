const error_ = module.exports = {
  new: (message, statusCode, ...context) => {
    const err = new Error(message)
    err.statusCode = statusCode
    err.context = context
    return err
  },
  // not using an arrow function as it messes with arguments
  reject: function () {
    const err = error_.new.apply(null, arguments)
    return Promise.reject(err)
  }
}
