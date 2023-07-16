import 'should'
import config from 'config'
import { simplify } from 'wikibase-sdk'
import { getSandboxPropertyId, getSandboxClaimId, getSandboxItemId, createItem } from '#tests/integration/utils/sandbox_entities'
import { addQualifier } from '#tests/integration/utils/sandbox_snaks'
import { undesiredRes } from '#tests/integration/utils/utils'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString, randomNumber } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)
const updateQualifier = wbEdit.qualifier.update
// Use years above 1583 to be sure to default to Gregorian calendar
const gregorianCalendarYear = 1583

describe('qualifier update', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should update a qualifier', async () => {
    const oldValue = randomString()
    const newValue = randomString()
    const { guid, property } = await addQualifier({ datatype: 'string', value: oldValue })
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const updatedQualifier = res.claim.qualifiers[property].slice(-1)[0]
    updatedQualifier.datavalue.value.should.deepEqual(newValue)
  })

  it('should fetch the properties it needs', done => {
    const oldValue = randomString()
    const newValue = randomString()
    addQualifier({ datatype: 'string', value: oldValue })
    .then(({ guid, property, qualifier }) => {
      return updateQualifier({ guid, property: 'P999999', oldValue, newValue })
      .then(undesiredRes(done))
      .catch(err => {
        err.message.should.equal('property not found')
        done()
      })
    })
    .catch(done)
  })

  it('should reject if old value is missing', done => {
    const oldValue = randomString()
    const newValue = randomString()
    Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string'),
    ])
    .then(([ guid, property ]) => {
      return updateQualifier({ guid, property, oldValue, newValue })
      .then(undesiredRes(done))
      .catch(err => {
        const possibleMessages = [ 'claim qualifiers not found', 'qualifier not found' ]
        possibleMessages.includes(err.message).should.be.true()
        done()
      })
    })
    .catch(done)
  })

  it('should update a wikibase-item claim', async () => {
    const oldValue = await getSandboxItemId()
    const someItem = await createItem()
    const newValue = someItem.id
    const { guid, property } = await addQualifier({ datatype: 'wikibase-item', value: oldValue })
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    qualifier.datavalue.value.id.should.deepEqual(newValue)
  })

  it('should update a monolingual text claim', async () => {
    const oldValue = { text: randomString(), language: 'fr' }
    const newValue = { text: randomString(), language: 'de' }
    const { guid, property } = await addQualifier({ datatype: 'monolingualtext', value: oldValue })
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    qualifier.datavalue.value.should.deepEqual(newValue)
  })

  it('should update a quantity claim with a unit', async () => {
    const oldValue = { amount: randomNumber(), unit: 'Q1' }
    const newValue = { amount: randomNumber(), unit: 'Q2' }
    const { guid, property } = await addQualifier({ datatype: 'quantity', value: oldValue })
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    simplify.qualifier(qualifier, { keepRichValues: true }).should.deepEqual(newValue)
  })

  it('should update a time claim with a day precision', async () => {
    const oldYear = 1000 + randomNumber(3)
    const newYear = 1000 + randomNumber(3)
    const oldValue = `${oldYear}-02-26`
    const newValue = `${newYear}-10-25`
    const { guid, property } = await addQualifier({ datatype: 'time', value: oldValue })
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    simplify.qualifier(qualifier, { timeConverter: 'simple-day' }).should.equal(newValue)
  })

  it('should update a time claim with a month precision', async () => {
    const oldValue = `${1000 + randomNumber(3)}-02`
    const newValue = `${1000 + randomNumber(3)}-03`
    const { guid, property } = await addQualifier({ datatype: 'time', value: oldValue })
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    simplify.qualifier(qualifier, { timeConverter: 'simple-day' }).should.equal(newValue)
  })

  it('should update a time claim with a year precision', async () => {
    const oldValue = (1000 + randomNumber(3)).toString()
    const newValue = (1000 + randomNumber(3)).toString()
    const { guid, property } = await addQualifier({ datatype: 'time', value: oldValue })
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    simplify.qualifier(qualifier, { timeConverter: 'simple-day' }).should.equal(newValue)
  })

  it('should update a time claim when passed a rich value', async () => {
    const oldValue = `${gregorianCalendarYear + randomNumber(3)}-04`
    const newValue = `${gregorianCalendarYear + randomNumber(3)}-05`
    const { guid, property } = await addQualifier({ datatype: 'time', value: oldValue })
    const richOldValue = {
      time: `+${oldValue}-01T00:00:00Z`,
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
    }
    const res = await updateQualifier({
      guid,
      property,
      oldValue: richOldValue,
      newValue,
    })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    simplify.qualifier(qualifier, { timeConverter: 'simple-day' }).should.equal(newValue)
  })

  it('should update a time claim when passed a rich value with a simplified time value', async () => {
    const oldValue = `${gregorianCalendarYear + randomNumber(3)}-06`
    const newValue = `${gregorianCalendarYear + randomNumber(3)}-07`
    const { guid, property } = await addQualifier({ datatype: 'time', value: oldValue })
    const richOldValue = {
      time: `${oldValue}-01`,
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
    }
    const res = await updateQualifier({
      guid,
      property,
      oldValue: richOldValue,
      newValue,
    })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    simplify.qualifier(qualifier, { timeConverter: 'simple-day' }).should.equal(newValue)
  })

  it('should update a globe-coordinate claim', async () => {
    const oldValue = {
      latitude: randomNumber(2),
      longitude: randomNumber(2),
      precision: 0.01,
      globe: 'http://www.wikidata.org/entity/Q111',
    }
    const newValue = {
      latitude: randomNumber(2),
      longitude: randomNumber(2),
      precision: 0.01,
      globe: 'http://www.wikidata.org/entity/Q112',
    }
    const { guid, property } = await addQualifier({ datatype: 'globe-coordinate', value: oldValue })
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const qualifier = res.claim.qualifiers[property].slice(-1)[0]
    const { value } = qualifier.datavalue
    value.latitude.should.equal(newValue.latitude)
    value.longitude.should.equal(newValue.longitude)
    value.precision.should.equal(newValue.precision)
    value.globe.should.equal(newValue.globe)
  })

  it('should update a qualifier with a special snaktype', async () => {
    const oldValue = { snaktype: 'novalue' }
    const newValue = { snaktype: 'somevalue' }
    const { guid, property, qualifier } = await addQualifier({ datatype: 'string', value: oldValue })
    qualifier.snaktype.should.equal('novalue')
    const res = await updateQualifier({ guid, property, oldValue, newValue })
    const updatedQualifier = res.claim.qualifiers[property].slice(-1)[0]
    updatedQualifier.snaktype.should.equal('somevalue')
  })
})
