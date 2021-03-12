require('should')
const config = require('config')
const wbEdit = require('root')(config)
const { randomString } = require('tests/unit/utils')
const { getSandboxItemId } = require('tests/integration/utils/sandbox_entities')
const language = 'fr'

describe('alias set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('tests/integration/utils/wait_for_instance'))

  it('should set an alias', async () => {
    const id = await getSandboxItemId()
    const value = randomString()
    const res = await wbEdit.alias.set({ id, language, value })
    res.success.should.equal(1)
  })
})
