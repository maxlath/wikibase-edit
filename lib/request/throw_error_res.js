module.exports = label => body => {
  if (body.error) {
    const err = new Error(label + ': ' + body.error.info)
    err.body = body
    throw err
  }
  return body
}
