require('should')
const { __, instance } = require('config')
const { randomString } = __.require('test/unit/utils')
const wbEdit = __.require('.')({ instance, anonymous: true })

const { getSandboxItemId } = __.require('test/integration/utils/sandbox_entities')

describe('anonymous edit', function () {
  this.timeout(20 * 1000)

  it('should make an anonymous edit', async () => {
    const id = await getSandboxItemId()
    const value = randomString()
    const res = await wbEdit.alias.add({ id, language: 'fr', value })
    res.success.should.equal(1)
  })
})
