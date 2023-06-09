import { instance, credentials, credentialsAlt } from 'config'
import should from 'should'
import GetAuthData from '#lib/request/get_auth_data'
import validateAndEnrichConfig from '#lib/validate_and_enrich_config'
import { isBotPassword } from '#tests/integration/utils/utils'

const { username, password } = credentialsAlt

describe('get auth data', function () {
  this.timeout(10000)

  it('should get token from username and password', async () => {
    const config = validateAndEnrichConfig({ instance, credentials: { username, password } })
    const getAuthData = GetAuthData(config)
    getAuthData.should.be.a.Function()
    const { token, cookie } = await getAuthData()
    token.length.should.equal(42)
    if (!isBotPassword(password)) {
      should(/.+UserID=\d+/.test(cookie)).be.true('should contain user ID')
    }
    should(/.+[sS]ession=\w{32}/.test(cookie)).be.true('should contain session ID')
  })

  it('should get token from oauth', async () => {
    const config = validateAndEnrichConfig({ instance, credentials })
    const getAuthData = GetAuthData(config)
    const { token } = await getAuthData()
    token.length.should.equal(42)
  })

  it('should return the same data when called before the token expired', async () => {
    const config = validateAndEnrichConfig({ instance, credentials })
    const getAuthData = GetAuthData(config)
    const dataA = await getAuthData()
    const dataB = await getAuthData()
    dataA.should.equal(dataB)
    dataA.token.should.equal(dataB.token)
  })

  it('should return refresh data if requested', async () => {
    const config = validateAndEnrichConfig({ instance, credentials })
    const getAuthData = GetAuthData(config)
    const dataA = await getAuthData()
    const dataB = await getAuthData({ refresh: true })
    dataA.should.not.equal(dataB)
  })
})
