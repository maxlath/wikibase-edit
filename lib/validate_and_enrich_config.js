const error_ = require('./error')
const parseInstance = require('./parse_instance')
const { name, version, homepage } = require('../package.json')
const { forceArray } = require('./utils')

module.exports = (generalConfig, requestConfig) => {
  generalConfig.userAgent = generalConfig.userAgent || `${name}/v${version} (${homepage})`

  let config
  if (requestConfig) {
    config = Object.assign({}, generalConfig, requestConfig)
  } else {
    config = generalConfig
    if (config._validatedAndEnriched) return config
  }

  parseInstance(config)
  if (config.instance == null) throw error_.new('invalid config object', { config })

  config.anonymous = config.anonymous === true

  if (!config.credentials && !config.anonymous) throw error_.new('missing credentials', { config })

  if (config.credentials) {
    if (!config.credentials.oauth && (!config.credentials.username || !config.credentials.password)) {
      throw error_.new('missing credentials')
    }

    // Oauth config will be validated by wikibase-token
    if (config.credentials.oauth && (config.credentials.username || config.credentials.password)) {
      throw error_.new('credentials can not be both oauth tokens, and a username and password')
    }

    // Making sure that the 'bot' flag was explicitly set to true
    config.bot = config.bot === true
  }

  let { summary, tags } = config

  if (summary != null) checkType('summary', summary, 'string')

  // on wikidata.org: set tag to wikibase-edit by default
  if (config.instance === 'https://www.wikidata.org') {
    tags = tags || 'WikibaseJS-edit'
  }

  if (tags != null) {
    tags = forceArray(tags)
    tags.forEach(tag => checkType('tags', tag, 'string'))
    config.tags = tags
  }

  config._validatedAndEnriched = true

  return config
}

const checkType = (name, value, type) => {
  if (typeof value !== type) { // eslint-disable-line valid-typeof
    throw error_.new(`invalid config ${name}`, { [name]: value, type: typeof summary })
  }
}
