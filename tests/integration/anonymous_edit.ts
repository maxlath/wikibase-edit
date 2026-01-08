import 'should'
import config from 'config'
import WBEdit from '../../src/lib/index.js'
import { randomString } from '../unit/utils.js'
import { getSandboxItemId } from './utils/sandbox_entities.js'
import { waitForInstance } from './utils/wait_for_instance.js'

const { instance } = config

describe('anonymous edit', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should make an anonymous edit when general config has anonymous=true', async () => {
    const wbEdit = WBEdit({ instance, anonymous: true })
    const id = await getSandboxItemId()
    const value = randomString()
    const res = await wbEdit.alias.add({ id, language: 'fr', value })
    res.success.should.equal(1)
  })

  it('should make an anonymous edit when request config has anonymous=true', async () => {
    const wbEdit = WBEdit({ instance })
    const id = await getSandboxItemId()
    const value = randomString()
    const res = await wbEdit.alias.add({ id, language: 'fr', value }, { anonymous: true })
    res.success.should.equal(1)
  })
})
