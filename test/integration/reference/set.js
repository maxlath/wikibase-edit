require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const setReference = wbEdit.reference.set
const { randomString } = __.require('test/unit/utils')
const { getSandboxClaimId, getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')

describe('reference set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should set a reference', async () => {
    const [ guid, property ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string')
    ])
    const value = randomString()
    const res = await setReference({ guid, property, value })
    res.success.should.equal(1)
    res.reference.snaks[property].slice(-1)[0].datavalue.value.should.equal(value)
  })
})
