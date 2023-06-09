import 'should'
import config from 'config'
import { getSandboxItemId } from '#tests/integration/utils/sandbox_entities'
import { wait } from '#tests/integration/utils/utils'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const { instance, credentials, credentialsAlt } = config
const language = 'fr'

describe('token expiration', function () {
  this.timeout(24 * 60 * 60 * 1000)

  before('wait for instance', waitForInstance)

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
