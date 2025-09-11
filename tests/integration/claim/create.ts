import 'should'
import config from 'config'
import { isGuid } from 'wikibase-sdk'
import { getSandboxPropertyId, getSandboxItemId } from '#tests/integration/utils/sandbox_entities'
import { shouldNotBeCalled } from '#tests/integration/utils/utils'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { assert, randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import type { SpecialSnak } from '../../../src/lib/claim/special_snaktype'
import type { CustomEditableTimeSnakValue } from '../../../src/lib/types/snaks'

const wbEdit = WBEdit(config)

describe('claim create', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should create a claim', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('string'),
    ])
    const value = randomString()
    const res = await wbEdit.claim.create({ id, property, value })
    res.success.should.equal(1)
    isGuid(res.claim.id).should.be.true()
    res.claim.rank.should.equal('normal')
    assert(res.claim.mainsnak.snaktype === 'value')
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })

  it('should create a claim with a negative year', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('time'),
    ])
    const res = await wbEdit.claim.create({ id, property, value: '-0028' })
    res.success.should.equal(1)
    isGuid(res.claim.id).should.be.true()
    res.claim.rank.should.equal('normal')
    assert(res.claim.mainsnak.snaktype === 'value')
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('time' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.time.should.equal('-0028-00-00T00:00:00Z')
  })

  it('should create a claim with a preferred rank', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('string'),
    ])
    const value = randomString()
    const res = await wbEdit.claim.create({ id, property, value, rank: 'preferred' })
    res.claim.rank.should.equal('preferred')
  })

  it('should create a claim with qualifiers and references', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('string'),
    ])
    const value = randomString()
    const res = await wbEdit.claim.create({
      id,
      property,
      value,
      rank: 'preferred',
      qualifiers: {
        [property]: value,
      },
      references: [
        { [property]: value },
        { [property]: value },
      ],
    })
    assert('datavalue' in res.claim.qualifiers[property][0])
    assert('datavalue' in res.claim.references[0].snaks[property][0])
    assert('datavalue' in res.claim.references[1].snaks[property][0])
    res.claim.qualifiers[property][0].datavalue.value.should.equal(value)
    res.claim.references[0].snaks[property][0].datavalue.value.should.equal(value)
    res.claim.references[1].snaks[property][0].datavalue.value.should.equal(value)
  })

  it('should create a time claim with a low precision', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('time'),
    ])
    const value = { time: '2500000', precision: 4 }
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('time' in res.claim.mainsnak.datavalue.value)
    assert('precision' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.time.should.equal('+2500000-00-00T00:00:00Z')
    res.claim.mainsnak.datavalue.value.precision.should.equal(4)
  })

  // time precision not supported by the Wikibase API
  xit('should create a time claim with a high precision', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('time'),
    ])
    const value = { time: '1802-02-04T11:22:33Z', precision: 14 }
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('time' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.time.should.equal('+1802-02-04T11:22:33Z')
    res.claim.mainsnak.datavalue.value.precision.should.equal(14)
  })

  it('should create a time claim with a custom calendar', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('time'),
    ])
    const value: CustomEditableTimeSnakValue = { time: '1402-11-12', calendar: 'julian' }
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('time' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.time.should.equal('+1402-11-12T00:00:00Z')
    res.claim.mainsnak.datavalue.value.calendarmodel.should.equal('http://www.wikidata.org/entity/Q1985786')
  })

  it('should reject a claim with an invalid time', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('time'),
    ])
    const value = '1802-22-33'
    try {
      await wbEdit.claim.create({ id, property, value }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid time value')
      err.context.value.should.equal(value)
    }
  })

  it('should create a external id claim', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('external-id'),
    ])
    const value = 'foo'
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    res.claim.mainsnak.datavalue.value.should.equal('foo')
  })

  it('should create a monolingualtext claim', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('monolingualtext'),
    ])
    const value = { text: 'bulgroz', language: 'fr' }
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('text' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.text.should.equal('bulgroz')
    res.claim.mainsnak.datavalue.value.language.should.equal('fr')
  })

  it('should create a url claim', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('url'),
    ])
    const value = 'http://foo.bar'
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })

  it('should create a quantity claim from a positive number value', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('quantity'),
    ])
    const value = 9000
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('amount' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.amount.should.equal('+9000')
    res.claim.mainsnak.datavalue.value.unit.should.equal('1')
  })

  it('should create a quantity claim from a negative number value', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('quantity'),
    ])
    const value = -9000
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('amount' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.amount.should.equal('-9000')
    res.claim.mainsnak.datavalue.value.unit.should.equal('1')
  })

  it('should create a quantity claim from a positive string value', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('quantity'),
    ])
    const value = '9001'
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('amount' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.amount.should.equal('+9001')
    res.claim.mainsnak.datavalue.value.unit.should.equal('1')
  })

  it('should create a quantity claim from a negative string value', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('quantity'),
    ])
    const value = '-9001'
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('amount' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.amount.should.equal('-9001')
    res.claim.mainsnak.datavalue.value.unit.should.equal('1')
  })

  it('should create a quantity claim with a custom unit and bounds', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('quantity'),
    ])
    const value = { amount: 9002, unit: 'Q7727', lowerBound: 9001, upperBound: 9013 }
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    assert(typeof res.claim.mainsnak.datavalue.value === 'object')
    assert('amount' in res.claim.mainsnak.datavalue.value)
    res.claim.mainsnak.datavalue.value.amount.should.equal('+9002')
    res.claim.mainsnak.datavalue.value.lowerBound.should.equal('+9001')
    res.claim.mainsnak.datavalue.value.upperBound.should.equal('+9013')
    res.claim.mainsnak.datavalue.value.unit.should.endWith('Q7727')
  })

  it('should create a globe coordinate claim', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('globe-coordinate'),
    ])
    const value = { latitude: 45.758, longitude: 4.84138, precision: 1 / 360 }
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    const createdValue = res.claim.mainsnak.datavalue.value
    assert(typeof createdValue === 'object' && 'latitude' in createdValue)
    createdValue.latitude.should.equal(value.latitude)
    createdValue.longitude.should.equal(value.longitude)
    createdValue.precision.should.equal(value.precision)
  })

  it('should create a geo-shape claim', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('geo-shape'),
    ])
    const value = 'Data:United Kingdom.map'
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })

  it('should create a tabular-data claim', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('tabular-data'),
    ])
    const value = 'Data:Sandbox/TheDJ/DJ.tab'
    const res = await wbEdit.claim.create({ id, property, value })
    assert('datavalue' in res.claim.mainsnak)
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })

  // Math and musical notation datatype aren't available on the wikibase-docker instance.

  it('should create a claim of snaktype novalue', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('url'),
    ])
    const value: SpecialSnak = { snaktype: 'novalue' }
    const res = await wbEdit.claim.create({ id, property, value })
    res.claim.mainsnak.snaktype.should.equal('novalue')
  })

  it('should create a claim of snaktype somevalue', async () => {
    const [ id, property ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('url'),
    ])
    const value: SpecialSnak = { snaktype: 'somevalue' }
    const res = await wbEdit.claim.create({ id, property, value })
    res.claim.mainsnak.snaktype.should.equal('somevalue')
  })
})
