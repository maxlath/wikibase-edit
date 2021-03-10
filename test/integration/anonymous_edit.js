require('should')
const { instance } = require('config')
const { randomString } = require('test/unit/utils')
const WBEdit = require('root')

const { getSandboxItemId } = require('test/integration/utils/sandbox_entities')

describe('anonymous edit', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('test/integration/utils/wait_for_instance'))

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
