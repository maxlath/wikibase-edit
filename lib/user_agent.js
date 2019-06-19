const { name, version, homepage } = require('../package.json')
const defaultUserAgent = `${name}/v${version} (${homepage})`

module.exports = (config = {}) => config.userAgent || defaultUserAgent
