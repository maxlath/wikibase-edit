require('should')
const config = require('config')
const wbEdit = require('root')(config)
const setQualifier = wbEdit.qualifier.set
const { randomString } = require('test/unit/utils')
const { getSandboxClaimId, getSandboxPropertyId } = require('test/integration/utils/sandbox_entities')

describe('qualifier set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('test/integration/utils/wait_for_instance'))

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

  it('should set a qualifier with a custom calendar', async () => {
    const [ guid, property ] = await Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('time')
    ])
    const res = await setQualifier({ guid, property, value: { time: '1802-02-26', calendar: 'julian' } })
    res.success.should.equal(1)
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    qualifier.datavalue.value.calendarmodel.should.equal('http://www.wikidata.org/entity/Q1985786')
  })
})
