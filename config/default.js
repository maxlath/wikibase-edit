const projectRoot = process.cwd()
const projectRelativeRequire = relativePath => require(`${projectRoot}/${relativePath}`)

// Log full objects
require('util').inspect.defaultOptions.depth = null

module.exports = {
  // A function to be able to make project root relative requires
  // ex: __.require('test/integration/utils/utils')
  '__': { require: projectRelativeRequire },

  // initConfig
  instance: 'http://localhost:8181',
  credentials: {
    oauth: {
      consumer_key: 'your-consumer-token',
      consumer_secret: 'your-secret-token',
      token: 'a-user-token',
      token_secret: 'a-secret-token'
    }
  },
  // Used for testing that both means of login work
  // but can be inverted or disabled if you can't get owner-only oauth tokens
  credentialsAlt: {
    username: 'your-wikidata-username',
    password: 'your-wikidata-password'
  }
}
