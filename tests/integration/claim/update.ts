import config from 'config'
import should from 'should'
import { simplify, type CustomSimplifiedClaim } from 'wikibase-sdk'
import type { SpecialSnak } from '#lib/claim/special_snaktype'
import { getSandboxItemId, getSandboxPropertyId, getReservedItemId } from '#tests/integration/utils/sandbox_entities'
import { addClaim, addReference } from '#tests/integration/utils/sandbox_snaks'
import { shouldNotBeCalled } from '#tests/integration/utils/utils'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString, randomNumber, assert } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)
const updateClaim = wbEdit.claim.update
const editEntity = wbEdit.entity.edit

describe('claim update', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  describe('find a claim from an item id, a property, and an old value', () => {
    it('should update a string claim', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { id, property, guid } = await addClaim({ datatype: 'string', value: oldValue })
      const res = await updateClaim({ id, property, oldValue, newValue })
      res.claim.id.should.equal(guid)
      simplify.claim(res.claim).should.equal(newValue)
    })

    it('should fetch the properties it needs', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { id } = await addClaim({ datatype: 'string', value: oldValue })
      try {
        await updateClaim({ id, property: 'P999999', oldValue, newValue }).then(shouldNotBeCalled)
      } catch (err) {
        err.message.should.equal('property not found')
      }
    })

    it('should update a wikibase-item claim', async () => {
      const [ oldValue, newValue ] = await Promise.all([ getSandboxItemId(), getReservedItemId() ])
      const { id, guid, property } = await addClaim({ datatype: 'wikibase-item', value: oldValue })
      const res = await updateClaim({ id, property, oldValue, newValue })
      res.claim.id.should.equal(guid)
      simplify.claim(res.claim).should.deepEqual(newValue)
    })

    it('should reject if old value is missing', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const [ id, property ] = await Promise.all([
        getSandboxItemId(),
        getSandboxPropertyId('string'),
      ])
      try {
        await updateClaim({ id, property, oldValue, newValue }).then(shouldNotBeCalled)
      } catch (err) {
        // Accept both messages as the sandbox item might not have pre-existing claims for that property
        const possibleMessages = [ 'no property claims found', 'claim not found' ]
        possibleMessages.includes(err.message).should.be.true()
      }
    })

    it('should reject claim updates from values when several claims match', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const [ res1 ] = await Promise.all([
        addClaim({ datatype: 'string', value: oldValue }),
        addClaim({ datatype: 'string', value: oldValue }),
      ])
      const { id, property } = res1
      try {
        await updateClaim({ id, property, oldValue, newValue }).then(shouldNotBeCalled)
      } catch (err) {
        err.message.should.equal('snak not found: too many matching snaks')
      }
    })

    it('should update a monolingual text claim being provided just the text', async () => {
      const oldValue = { text: randomString(), language: 'fr' }
      const newValueText = randomString()
      const { id, guid, property } = await addClaim({ datatype: 'monolingualtext', value: oldValue })
      const res = await updateClaim({ id, property, oldValue: oldValue.text, newValue: newValueText })
      res.claim.id.should.equal(guid)
      simplify.claim(res.claim, { keepRichValues: true }).should.deepEqual({ text: newValueText, language: oldValue.language })
    })
  })

  describe('find a claim from a guid', () => {
    it('should update a claim', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { guid, property } = await addClaim({ datatype: 'string', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.id.should.equal(guid)
      assert('datavalue' in res.claim.mainsnak)
      res.claim.mainsnak.datavalue.value.should.equal(newValue)
    })
  })

  describe('common', () => {
    it('should keep the references and qualifiers', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const qualifierValue = randomString()
      const referenceValue = randomString()
      const [ id, property ] = await Promise.all([
        getSandboxItemId(),
        getSandboxPropertyId('string'),
      ])
      const claim = { value: oldValue, qualifiers: {}, references: {} }
      claim.qualifiers[property] = qualifierValue
      claim.references[property] = referenceValue
      const data = { id, claims: {} }
      data.claims[property] = claim
      const resA = await editEntity(data)
      assert('claims' in resA.entity)
      const resAClaim = resA.entity.claims[property].slice(-1)[0]
      const guid = resAClaim.id
      const resB = await updateClaim({ id, property, oldValue, newValue })
      const simplifiedClaim = simplify.claim(resB.claim, { keepIds: true, keepQualifiers: true, keepReferences: true }) as CustomSimplifiedClaim
      simplifiedClaim.id.should.equal(guid)
      simplifiedClaim.value.should.equal(newValue)
      simplifiedClaim.qualifiers[property][0].should.equal(qualifierValue)
      simplifiedClaim.references[0][property][0].should.equal(referenceValue)
    })

    it('should update a wikibase-item', async () => {
      const [ oldValue, newValue ] = await Promise.all([ getSandboxItemId(), getReservedItemId() ])
      const { guid, property } = await addClaim({ datatype: 'wikibase-item', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.id.should.equal(guid)
      simplify.claim(res.claim).should.deepEqual(newValue)
    })

    it('should update a monolingual text claim', async () => {
      const oldValue = { text: randomString(), language: 'fr' }
      const newValue = { text: randomString(), language: 'de' }
      const { guid, property } = await addClaim({ datatype: 'monolingualtext', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.id.should.equal(guid)
      simplify.claim(res.claim, { keepRichValues: true }).should.deepEqual(newValue)
    })

    it('should update a quantity claim with a unit', async () => {
      const oldValue = { amount: randomNumber(), unit: 'Q1' }
      const newValue = { amount: randomNumber(), unit: 'Q2' }
      const { guid, property } = await addClaim({ datatype: 'quantity', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.id.should.equal(guid)
      simplify.claim(res.claim, { keepRichValues: true }).should.deepEqual(newValue)
    })

    it('should update a time claim', async () => {
      // Use years after change from Julian to Gregorian calendar
      const oldYear = 1800 + randomNumber(2)
      const newYear = 1800 + randomNumber(2)
      const oldValue = `${oldYear}-02-26`
      const newValue = `${newYear}-10-25`
      const { guid, property } = await addClaim({ datatype: 'time', value: { time: oldValue, precision: 10, timezone: -60, before: 2, after: 3 } })
      const res = await updateClaim({ guid, property, newValue: { time: newValue, precision: 11, before: 5 } })
      res.claim.id.should.equal(guid)
      assert('datavalue' in res.claim.mainsnak)
      should(res.claim.mainsnak.datavalue.value).deepEqual({
        time: `+${newValue}T00:00:00Z`,
        before: 5,
        precision: 11,
        calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
        // It doesn't preserve old values
        timezone: 0,
        after: 0,
      })
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
      const { guid, property } = await addClaim({ datatype: 'globe-coordinate', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.id.should.equal(guid)
      assert('datavalue' in res.claim.mainsnak)
      const { value } = res.claim.mainsnak.datavalue
      assert(typeof value === 'object')
      assert('latitude' in value)
      value.latitude.should.equal(newValue.latitude)
      value.longitude.should.equal(newValue.longitude)
      value.precision.should.equal(newValue.precision)
      value.globe.should.equal(newValue.globe)
    })

    it('should update a claim rank', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { guid, property } = await addClaim({ datatype: 'string', value: oldValue })
      const res = await updateClaim({ guid, property, newValue, rank: 'preferred' })
      res.claim.rank.should.equal('preferred')
    })

    it('should be able to only update a claim rank', async () => {
      const oldValue = randomString()
      const { guid } = await addClaim({ datatype: 'string', value: oldValue })
      const res = await updateClaim({ guid, rank: 'preferred' })
      res.claim.rank.should.equal('preferred')
    })

    it('should update a claim snaktype', async () => {
      const oldValue = randomString()
      const newValue: SpecialSnak = { snaktype: 'novalue' }
      const { guid, property } = await addClaim({ datatype: 'string', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.mainsnak.snaktype.should.equal('novalue')
    })

    it('should preserve references rich time values', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { id, property, guid } = await addClaim({ datatype: 'string', value: oldValue })
      await addReference({ guid, datatype: 'time', value: { time: '2024-01-12', timezone: 60 } })
      const res = await updateClaim({ id, property, oldValue, newValue })
      const referenceTimeSnak = Object.values(res.claim.references[0].snaks)[0][0]
      assert('datavalue' in referenceTimeSnak)
      const referenceTimeValue = referenceTimeSnak.datavalue.value
      referenceTimeValue.should.deepEqual({
        time: '+2024-01-12T00:00:00Z',
        timezone: 60,
        before: 0,
        after: 0,
        precision: 11,
        calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
      })
    })
  })
})
