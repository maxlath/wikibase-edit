require('should')
const config = require('config')
const wbEdit = require('root')(config)
const { randomString } = require('tests/unit/utils')
const { getSandboxItemId } = require('tests/integration/utils/sandbox_entities')
const language = 'fr'

describe('alias add', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('tests/integration/utils/wait_for_instance'))

  it('should add an alias', async () => {
    const id = await getSandboxItemId()
    const value = randomString()
    const res = await wbEdit.alias.add({ id, language, value })
    res.success.should.equal(1)
  })

  it('should add several aliases', async () => {
    const id = await getSandboxItemId()
    const aliases = [
      randomString(),
      randomString(),
      randomString(),
      randomString()
    ]
    const res = await wbEdit.alias.add({ id, language, value: aliases })
    res.success.should.equal(1)
  })
})
