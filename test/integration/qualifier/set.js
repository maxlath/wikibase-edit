require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const setQualifier = wbEdit.qualifier.set
const { randomString } = __.require('test/unit/utils')
const { getSandboxClaimId, getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')

describe('qualifier set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should set a qualifier', async () => {
    const [ guid, property ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string')
    ])
    const value = randomString()
    const res = await setQualifier({ guid, property, value })
    res.success.should.equal(1)
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    qualifier.datavalue.value.should.equal(value)
  })
})
