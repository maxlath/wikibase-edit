require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const updateClaim = wbEdit.claim.update
const editEntity = wbEdit.entity.edit
const { shouldNotBeCalled } = __.require('test/integration/utils/utils')
const { getSandboxItemId, getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')
const { addClaim } = __.require('test/integration/utils/sandbox_snaks')
const { randomString, randomNumber } = __.require('test/unit/utils')
const { simplify } = require('wikibase-sdk')

describe('claim update', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  describe('find a claim from an item id, a property, and an old value', () => {
    it('should update a claim', async () => {
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

    it('should reject if old value is missing', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const [ id, property ] = await Promise.all([
        getSandboxItemId(),
        getSandboxPropertyId('string')
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
        addClaim({ datatype: 'string', value: oldValue })
      ])
      const { id, property } = res1
      try {
        await updateClaim({ id, property, oldValue, newValue }).then(shouldNotBeCalled)
      } catch (err) {
        err.message.should.equal('snak not found: too many matching snaks')
      }
    })
  })

  describe('find a claim from a guid', () => {
    it('should update a claim', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { guid, property } = await addClaim({ datatype: 'string', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.id.should.equal(guid)
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
        getSandboxPropertyId('string')
      ])
      const claim = { value: oldValue, qualifiers: {}, references: {} }
      claim.qualifiers[property] = qualifierValue
      claim.references[property] = referenceValue
      const data = { id, claims: {} }
      data.claims[property] = claim
      const resA = await editEntity(data)
      const resAClaim = resA.entity.claims[property].slice(-1)[0]
      const guid = resAClaim.id
      const resB = await updateClaim({ id, property, oldValue, newValue })
      const simplifiedClaim = simplify.claim(resB.claim, { keepIds: true, keepQualifiers: true, keepReferences: true })
      simplifiedClaim.id.should.equal(guid)
      simplifiedClaim.value.should.equal(newValue)
      simplifiedClaim.qualifiers[property][0].should.equal(qualifierValue)
      simplifiedClaim.references[0][property][0].should.equal(referenceValue)
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
      const oldYear = 1000 + randomNumber(3)
      const newYear = 1000 + randomNumber(3)
      const oldValue = `${oldYear}-02-26`
      const newValue = `${newYear}-10-25`
      const { guid, property } = await addClaim({ datatype: 'time', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.id.should.equal(guid)
      simplify.claim(res.claim).split('T')[0].should.equal(newValue)
    })

    it('should update a globe-coordinate claim', async () => {
      const oldValue = {
        latitude: randomNumber(2),
        longitude: randomNumber(2),
        precision: 0.01,
        globe: 'http://www.wikidata.org/entity/Q111'
      }
      const newValue = {
        latitude: randomNumber(2),
        longitude: randomNumber(2),
        precision: 0.01,
        globe: 'http://www.wikidata.org/entity/Q112'
      }
      const { guid, property } = await addClaim({ datatype: 'globe-coordinate', value: oldValue })
      const res = await updateClaim({ guid, property, newValue })
      res.claim.id.should.equal(guid)
      const { value } = res.claim.mainsnak.datavalue
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
  })
})
