require('should')
const config = require('config')
const { __ } = config
const updateClaim = __.require('.')(config).claim.update
const editEntity = __.require('.')(config).entity.edit
const { undesiredRes } = __.require('test/integration/utils/utils')
const { getSandboxItemId, getSandboxPropertyId, addClaim } = __.require('test/integration/utils/sandbox_entities')
const { randomString } = __.require('test/unit/utils')
const { simplify } = require('wikibase-sdk')

describe('claim update', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  describe('find a claim from an item id, a property, and an old value', () => {
    it('should update a claim', done => {
      const oldValue = randomString()
      const newValue = randomString()
      addClaim('string', oldValue)
      .then(({ id, property, guid }) => {
        return updateClaim({ id, property, oldValue, newValue })
        .then(res => {
          res.claim.id.should.equal(guid)
          res.claim.mainsnak.datavalue.value.should.equal(newValue)
          done()
        })
      })
      .catch(done)
    })

    it('should reject if old value is missing', done => {
      const oldValue = randomString()
      const newValue = randomString()
      Promise.all([
        getSandboxItemId(),
        getSandboxPropertyId('string')
      ])
      .then(([ id, property ]) => updateClaim({ id, property, oldValue, newValue }))
      .then(undesiredRes(done))
      .catch(err => {
        // Accept both messages as the sandbox item might not have pre-existing claims for that property
        const possibleMessages = [ 'no property claims found', 'claim not found' ]
        possibleMessages.includes(err.message).should.be.true()
        done()
      })
      .catch(done)
    })

    it('should reject claim updates from values when several claims match', done => {
      const oldValue = randomString()
      const newValue = randomString()
      Promise.all([
        addClaim('string', oldValue),
        addClaim('string', oldValue)
      ])
      .then(([ res1, res2 ]) => {
        const { id, property } = res1
        return updateClaim({ id, property, oldValue, newValue })
      })
      .then(undesiredRes(done))
      .catch(err => {
        err.message.should.equal('snak not found: too many matching snaks')
        done()
      })
      .catch(done)
    })
  })

  describe('find a claim from a guid', () => {
    it('should update a claim', done => {
      const oldValue = randomString()
      const newValue = randomString()
      addClaim('string', oldValue)
      .then(({ property, guid }) => {
        return updateClaim({ guid, property, newValue })
        .then(res => {
          res.claim.id.should.equal(guid)
          res.claim.mainsnak.datavalue.value.should.equal(newValue)
          done()
        })
      })
      .catch(done)
    })
  })

  describe('common', () => {
    it('should keep the references and qualifiers', done => {
      const oldValue = randomString()
      const newValue = randomString()
      const qualifierValue = randomString()
      const referenceValue = randomString()
      Promise.all([
        getSandboxItemId(),
        getSandboxPropertyId('string')
      ])
      .then(([ id, property ]) => {
        const claim = { value: oldValue, qualifiers: {}, references: {} }
        claim.qualifiers[property] = qualifierValue
        claim.references[property] = referenceValue
        const data = { id, claims: {}}
        data.claims[property] = claim
        return editEntity(data)
        .then(resA => {
          const claim = resA.entity.claims[property].slice(-1)[0]
          const guid = claim.id
          return updateClaim({ id, property, oldValue, newValue })
          .then(resB => {
            const simplifiedClaim = simplify.claim(resB.claim, { keepIds: true, keepQualifiers: true, keepReferences: true })
            simplifiedClaim.id.should.equal(guid)
            simplifiedClaim.value.should.equal(newValue)
            simplifiedClaim.qualifiers[property][0].should.equal(qualifierValue)
            simplifiedClaim.references[0][property][0].should.equal(referenceValue)
            done()
          })
        })
      })
      .catch(done)
    })
  })
})
