const should = require('should')
const { instance, credentials, credentialsAlt, __ } = require('config')
const { username, password } = credentialsAlt
const { undesiredRes } = __.require('test/integration/utils/utils')
const wikibaseToken = __.require('lib/request/wikibase_token')
const validateAndEnrichConfig = __.require('lib/validate_and_enrich_config')

describe('auth tokens', function () {
  this.timeout(10000)

  it('should get token from username and password', done => {
    const config = validateAndEnrichConfig({ instance, credentials: { username, password } })
    const tokenGetter = wikibaseToken(config)
    tokenGetter.should.be.a.Function()
    tokenGetter()
    .then(res => {
      res.token.length.should.be.above(40)
      const { cookie } = res
      should(/.+[sS]ession=\w{32}/.test(cookie)).be.true('should contain session ID')
      should(/.+UserID=\d+/.test(cookie)).be.true('should contain user ID')
      done()
    })
    .catch(done)
  })

  it('should get token from oauth', done => {
    const config = validateAndEnrichConfig({ instance, credentials })
    const tokenGetter = wikibaseToken(config)
    tokenGetter.should.be.a.Function()
    tokenGetter()
    .then(res => {
      res.token.length.should.be.above(40)
      done()
    })
    .catch(done)
  })

  it('should reject on invalid username/password credentials', done => {
    const invalidCreds = { username: 'inva', password: 'lid' }
    const config = validateAndEnrichConfig({ instance, credentials: invalidCreds })
    const tokenGetter = wikibaseToken(config)
    tokenGetter.should.be.a.Function()
    tokenGetter()
    .then(undesiredRes(done))
    .catch(err => {
      err.message.should.equal('failed to login: invalid username/password')
      done()
    })
    .catch(done)
  })

  it('should reject on invalid oauth credentials', done => {
    const invalidCreds = {
      oauth: {
        consumer_key: 'in',
        consumer_secret: 'va',
        token: 'li',
        token_secret: 'd'
      }
    }
    const config = validateAndEnrichConfig({ instance, credentials: { oauth: invalidCreds } })
    const tokenGetter = wikibaseToken(config)
    tokenGetter.should.be.a.Function()
    tokenGetter()
    .then(undesiredRes(done))
    .catch(err => {
      err.message.should.endWith('Invalid consumer')
      done()
    })
    .catch(done)
  })
})
