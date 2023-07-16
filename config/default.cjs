// Log full objects
require('util').inspect.defaultOptions.depth = null

module.exports = {
  // initConfig
  instance: 'http://localhost:8181',
  statementsKey: 'claims',
  credentials: {
    oauth: {
      consumer_key: 'some-consumer-token',
      consumer_secret: 'some-secret-token',
      token: 'some-user-token',
      token_secret: 'some-secret-token'
    }
  },
  // Used for testing that both means of login work
  // but can be inverted or disabled if you can't get owner-only oauth tokens
  credentialsAlt: {
    username: 'some-username',
    password: 'some-password'
  },
  secondUserCredentials: {
    username: 'another-username',
    password: 'another-password'
  }
}
