module.exports = (getAuthData, loggers) => {
  const { Log, LogError } = loggers
  return url => {
    return getAuthData()
    .then(authData => {
      const headers = { 'Cookie': authData.cookie, 'User-Agent': userAgent }
      return insistentReq('get', { url, headers, oauth })
    })
    .then(_.property('body'))
    .then(throwErrorRes('get err'))
    .then(Log(`${url} res body`))
    .catch(LogError(`${action} err`))
  }
}
