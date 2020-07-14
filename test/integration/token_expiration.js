require('should')
const config = require('config')
const { __, instance, credentials, credentialsAlt } = config
const WBEdit = __.require('.')
const { randomString } = __.require('test/unit/utils')
const { getSandboxItemId } = __.require('test/integration/utils/sandbox_entities')
const language = 'fr'
const { wait } = __.require('test/integration/utils/utils')

describe('token expiration', function () {
  this.timeout(24 * 60 * 60 * 1000)

  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  xit('should renew tokens (oauth)', async () => {
    const wbEdit = WBEdit({ instance, credentials })
    const id = await getSandboxItemId()
    const doActionRequiringAuthPeriodically = async () => {
      const value = randomString()
      const res = await wbEdit.alias.add({ id, language, value })
      res.success.should.equal(1)
      console.log(new Date().toISOString(), 'added alias', value)
      await wait(60 * 1000)
      return doActionRequiringAuthPeriodically()
    }
    await doActionRequiringAuthPeriodically()
  })

  xit('should renew tokens (username/password)', async () => {
    const wbEdit = WBEdit({ instance, credentials: credentialsAlt })
    const id = await getSandboxItemId()
    const doActionRequiringAuthPeriodically = async () => {
      const value = randomString()
      const res = await wbEdit.alias.add({ id, language, value })
      res.success.should.equal(1)
      console.log(new Date().toISOString(), 'added alias', value)
      await wait(60 * 1000)
      return doActionRequiringAuthPeriodically()
    }
    await doActionRequiringAuthPeriodically()
  })
})
