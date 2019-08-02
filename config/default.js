const projectRoot = process.cwd()
const projectRelativeRequire = relativePath => require(`${projectRoot}/${relativePath}`)

module.exports = {
  // A function to be able to make project root relative requires
  // ex: __.require('test/integration/utils/utils')
  '__': { require: projectRelativeRequire },

  // initConfig
  instance: 'http://localhost:8181',
  verbose: 2,
  credentials: {
    username: 'your-wikidata-username',
    password: 'your-wikidata-password',
    // OR
    oauth: {
      consumer_key: 'your-consumer-token',
      consumer_secret: 'your-secret-token',
      token: 'a-user-token',
      token_secret: 'a-secret-token'
    }
  }
}
