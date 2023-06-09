import 'should'
import { instance } from 'config'
import { getSandboxItemId } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'

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
