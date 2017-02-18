const { version } = require('../package.json')
const defaultUserAgent = `wikidata-edit/${version} (https://github.com/maxlath/wikidata-edit)`

module.exports = (config = {}) => config.userAgent || defaultUserAgent
