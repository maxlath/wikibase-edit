import 'should'
import config from 'config'
import WBEdit from '../../../src/lib/index.js'
import { assert, randomString } from '../../unit/utils.js'
import { getSandboxClaim } from '../utils/sandbox_entities.js'
import { waitForInstance } from '../utils/wait_for_instance.js'

const wbEdit = WBEdit(config)

describe('claim set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should set a claim', async () => {
    const claim = await getSandboxClaim()
    const { property } = claim.mainsnak
    const value = randomString()
    const res = await wbEdit.claim.set({ guid: claim.id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })
})
