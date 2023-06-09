import 'should'
import config from 'config'
import { getSandboxClaim } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import wbEditFactory from '#root'

const wbEdit = wbEditFactory(config)

describe('claim set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should set a claim', async () => {
    const claim = await getSandboxClaim()
    const { property } = claim.mainsnak
    const value = randomString()
    const res = await wbEdit.claim.set({ guid: claim.id, property, value })
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })
})
