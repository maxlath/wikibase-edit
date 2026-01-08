import 'should'
import config from 'config'
import WBEdit from '../../src/lib/index.js'
import { randomString } from '../unit/utils.js'
import { getSandboxItemId } from './utils/sandbox_entities.js'
import { wait } from './utils/utils.js'
import { waitForInstance } from './utils/wait_for_instance.js'

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
