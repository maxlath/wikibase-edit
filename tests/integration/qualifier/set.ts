import 'should'
import config from 'config'
import { getSandboxClaimId, getSandboxPropertyId } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { assert, randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)
const setQualifier = wbEdit.qualifier.set

describe('qualifier set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should set a qualifier', async () => {
    const [ guid, property ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string'),
    ])
    const value = randomString()
    const res = await setQualifier({ guid, property, value })
    res.success.should.equal(1)
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    assert('datavalue' in qualifier)
    qualifier.datavalue.value.should.equal(value)
  })

  it('should set a qualifier with a custom calendar', async () => {
    const [ guid, property ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('time'),
    ])
    const res = await setQualifier({ guid, property, value: { time: '1802-02-26', calendar: 'julian' } })
    res.success.should.equal(1)
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    assert('datavalue' in qualifier)
    assert(typeof qualifier.datavalue.value === 'object')
    assert('calendarmodel' in qualifier.datavalue.value)
    qualifier.datavalue.value.calendarmodel.should.equal('http://www.wikidata.org/entity/Q1985786')
  })
})
