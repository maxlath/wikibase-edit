import config from 'config'
import should from 'should'
import WBEdit from '../../src/lib/index.js'
import { waitForInstance } from './utils/wait_for_instance.js'

describe('dry', function () {
  this.timeout(120 * 1000)
  before('wait for instance', waitForInstance)

  it('should accept a dry flag from the general config', async () => {
    const customConfig = { ...config, dry: true }
    const wbEdit = WBEdit(customConfig)
    const res = await wbEdit.alias.add({ id: 'Q1', language: 'fr', value: 'foo' })
    should(res).not.be.ok()
  })

  it('should accept a dry flag from the request config', async () => {
    const wbEdit = WBEdit(config)
    const res = await wbEdit.alias.add({ id: 'Q1', language: 'fr', value: 'foo' }, { dry: true })
    should(res).not.be.ok()
  })
})
