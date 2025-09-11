import 'should'
import config from 'config'
import { getSandboxClaimId, getSandboxPropertyId, getRefreshedClaim } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)
const setReference = wbEdit.reference.set

describe('reference set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should set a reference with the property/value interface', async () => {
    const [ guid, property ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string'),
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
      getSandboxPropertyId('quantity'),
    ])
    const stringValue = randomString()
    const quantityValue = Math.random()
    const snaks = {
      [stringProperty]: [
        { snaktype: 'novalue' },
        stringValue,
      ],
      [quantityProperty]: quantityValue,
    }
    const res = await setReference({ guid, snaks })
    res.success.should.equal(1)
    res.reference.snaks[stringProperty][0].snaktype.should.equal('novalue')
    res.reference.snaks[stringProperty][1].datavalue.value.should.equal(stringValue)
    res.reference.snaks[quantityProperty][0].datavalue.value.amount.should.equal(`+${quantityValue}`)
  })

  it('should update a reference by passing a hash', async () => {
    const [ guid, stringProperty, quantityProperty ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string'),
      getSandboxPropertyId('quantity'),
    ])
    const initialClaim = await getRefreshedClaim(guid)
    const stringValue = randomString()
    const quantityValue = Math.random()
    const initialSnaks = {
      [stringProperty]: { snaktype: 'novalue' },
    }
    const res1 = await setReference({ guid, snaks: initialSnaks })
    res1.reference.snaks[stringProperty][0].snaktype.should.equal('novalue')
    const { hash } = res1.reference
    const updatedSnaks = {
      [stringProperty]: stringValue,
      [quantityProperty]: quantityValue,
    }
    const res2 = await setReference({ guid, hash, snaks: updatedSnaks }, { summary: 'here' })
    res2.reference.snaks[stringProperty][0].datavalue.value.should.equal(stringValue)
    res2.reference.snaks[quantityProperty][0].datavalue.value.amount.should.equal(`+${quantityValue}`)
    const claim = await getRefreshedClaim(guid)
    claim.references.length.should.equal(initialClaim.references.length + 1)
    claim.references.slice(-1)[0].hash.should.equal(res2.reference.hash)
  })
})
