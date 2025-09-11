import config from 'config'
import should from 'should'
import GetToken from '#lib/request/get_token'
import validateAndEnrichConfig from '#lib/validate_and_enrich_config'
import { undesiredRes, isBotPassword, shouldNotBeCalled } from '#tests/integration/utils/utils'

const { instance, credentials, credentialsAlt } = config

const { username, password } = credentialsAlt

describe('get token', function () {
  this.timeout(10000)

  it('should get token from username and password', async () => {
    const config = validateAndEnrichConfig({ instance, credentials: { username, password } })
    const getToken = GetToken(config)
    getToken.should.be.a.Function()
    const { cookie, token } = await getToken()
    token.length.should.be.above(40)
    if (!isBotPassword(password)) {
      should(/.+UserID=\d+/.test(cookie)).be.true('should contain user ID')
    }
    should(/.+[sS]ession=\w{32}/.test(cookie)).be.true('should contain session ID')
  })

  it('should get token from oauth', async () => {
    const config = validateAndEnrichConfig({ instance, credentials })
    const getToken = GetToken(config)
    getToken.should.be.a.Function()
    const { token } = await getToken()
    token.length.should.be.above(40)
  })

  // This test would need to run in a browser
  xit('should get token from browser session', async () => {
    const config = validateAndEnrichConfig({ instance, credentials: { browserSession: true } })
    const getToken = GetToken(config)
    getToken.should.be.a.Function()
    await getToken()
    .then(shouldNotBeCalled)
    .catch(err => {
      // In absence of a valid browser session, getting the csrf token will fail
      err.message.should.containEql('could not get tokens')
    })
  })

  it('should reject on invalid username/password credentials', done => {
    const invalidCreds = { username: 'inva', password: 'lid' }
    const config = validateAndEnrichConfig({ instance, credentials: invalidCreds })
    const getToken = GetToken(config)
    getToken.should.be.a.Function()
    getToken()
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
        token_secret: 'd',
      },
    }
    const config = validateAndEnrichConfig({ instance, credentials: { oauth: invalidCreds } })
    const getToken = GetToken(config)
    getToken.should.be.a.Function()
    getToken()
    .then(undesiredRes(done))
    .catch(err => {
      err.message.should.endWith('Invalid consumer')
      done()
    })
    .catch(done)
  })
})
