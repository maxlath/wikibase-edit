const validateAndFormatData = require('./validate_and_format_data')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return data => {
    return validateAndFormatData(data)
    .then(post.bind(null, 'wbeditentity'))
    .then(Log('edit entity res'))
    .catch(LogError('edit entity err'))
  }
}
