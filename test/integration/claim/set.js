require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const { getSandboxClaim } = __.require('test/integration/utils/sandbox_entities')

describe('claim set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should set a claim', async () => {
    const claim = await getSandboxClaim()
    const { property } = claim.mainsnak
    const value = randomString()
    const res = await wbEdit.claim.set({ guid: claim.id, property, value })
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })
})
