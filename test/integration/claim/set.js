require('module-alias/register')
require('should')
const config = require('config')
const wbEdit = require('root')(config)
const { randomString } = require('test/unit/utils')
const { getSandboxClaim } = require('test/integration/utils/sandbox_entities')

describe('claim set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('test/integration/utils/wait_for_instance'))

  it('should set a claim', async () => {
    const claim = await getSandboxClaim()
    const { property } = claim.mainsnak
    const value = randomString()
    const res = await wbEdit.claim.set({ guid: claim.id, property, value })
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })
})
