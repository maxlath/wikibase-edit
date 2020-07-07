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

  it('should set a reference with the property/value interface', async () => {
    const [ guid, property ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string')
    ])
    const value = randomString()
    const res = await setReference({ guid, property, value })
    res.success.should.equal(1)
    res.reference.snaks[property][0].datavalue.value.should.equal(value)
  })

  it('should set a reference with the snaks object interface', async () => {
    const [ guid, stringProperty, quantityProperty ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string'),
      getSandboxPropertyId('quantity')
    ])
    const stringValue = randomString()
    const quantityValue = Math.random()
    const snaks = {
      [stringProperty]: [
        { snaktype: 'novalue' },
        stringValue
      ],
      [quantityProperty]: quantityValue
    }
    const res = await setReference({ guid, snaks })
    res.success.should.equal(1)
    res.reference.snaks[stringProperty][0].snaktype.should.equal('novalue')
    res.reference.snaks[stringProperty][1].datavalue.value.should.equal(stringValue)
    res.reference.snaks[quantityProperty][0].datavalue.value.amount.should.equal(`+${quantityValue}`)
  })
})
