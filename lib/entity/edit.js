const validateAndFormatData = require('./validate_and_format_data')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return data => {
    return _validateAndFormatData(data)
    .then(post.bind(null, 'wbeditentity'))
    .then(Log('edit entity res'))
    .catch(LogError('edit entity err'))
  }
}

const _validateAndFormatData = data => {
  return new Promise((resolve, reject) => {
    try {
      const params = validateAndFormatData(data)
      resolve(params)
    } catch (err) {
      reject(err)
    }
  })
}
