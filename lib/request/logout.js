const request = require('./request')
const { buildUrl } = require('../utils')

module.exports = (instance, token) => {
  return request('post', {
    url: buildUrl(
      `${instance}/w/api.php`, {
        action: 'logout',
        format: 'json'
      }
    ),
    headers: {},
    body: { token }
  })
}
