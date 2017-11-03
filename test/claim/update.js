require('should')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')(CONFIG)
const addReference = require('../../lib/reference/add')(CONFIG)
const updateClaim = require('../../lib/claim/update')(CONFIG)
const { randomString, randomNumber, sandboxEntity, sandboxStringProp } = require('../../lib/tests_utils')
const wdk = require('wikidata-sdk')

describe('claim update', () => {
  it('should be a function', done => {
    updateClaim.should.be.a.Function()
    done()
  })

  it('should reject if old value is missing', function (done) {
    this.timeout(20 * 1000)
    const oldValue = randomString()
    const newValue = randomString()
    updateClaim(sandboxEntity, sandboxStringProp, oldValue, newValue)
    .catch(err => {
      // Accept both messages as the sandbox entity might have been cleaned
      // and no pre-existing P370 claim exist
      const possibleMessages = [
        'no property claims found',
        'claim not found'
      ]
      possibleMessages.includes(err.message).should.be.true()
      done()
    })
    .catch(done)
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should update a claim', function (done) {
    this.timeout(20 * 1000)
    const oldValue = randomString()
    const newValue = randomString()
    addClaim(sandboxEntity, sandboxStringProp, oldValue)
    .then(res1 => {
      return updateClaim(sandboxEntity, sandboxStringProp, oldValue, newValue)
      .then(res2 => {
        res1.claim.id.should.equal(res2.claim.id)
        wdk.simplify.claim(res2.claim).should.equal(newValue)
        done()
      })
    })
    .catch(done)
  })

  it('should keep the references and qualifiers', function (done) {
    this.timeout(20 * 1000)
    const oldValue = randomString()
    const newValue = randomString()
    addClaim(sandboxEntity, sandboxStringProp, oldValue, 'Q328')
    .then(res1 => {
      return addReference(res1.claim.id, 'P155', 'Q13406268')
      .then(refRes => {
        return updateClaim(sandboxEntity, sandboxStringProp, oldValue, newValue)
        .then(res2 => {
          refRes.reference.hash.should.equal(res2.claim.references[0].hash)
          done()
        })
      })
    })
    .catch(done)
  })

  it('should update a monolingual text claim', function (done) {
    this.timeout(20 * 1000)
    const property = 'P3132'
    const oldValue = { text: randomString(), language: 'fr' }
    const newValue = { text: randomString(), language: 'de' }
    addClaim(sandboxEntity, property, oldValue)
    .then(res1 => {
      return updateClaim(sandboxEntity, 'P3132', oldValue, newValue)
      .then(res2 => {
        res1.claim.id.should.equal(res2.claim.id)
        wdk.simplify.claim(res2.claim).should.equal(newValue.text)
        done()
      })
    })
    .catch(done)
  })

  it('should update a quantity claim with a unit', function (done) {
    this.timeout(20 * 1000)
    const property = 'P2130'
    const oldValue = { amount: randomNumber(3), unit: 'Q4916' }
    const newValue = { amount: randomNumber(3), unit: 'Q4916' }
    addClaim(sandboxEntity, property, oldValue)
    .then(res1 => {
      return updateClaim(sandboxEntity, property, oldValue, newValue)
      .then(res2 => {
        res1.claim.id.should.equal(res2.claim.id)
        wdk.simplify.claim(res2.claim).should.equal(newValue.amount)
        done()
      })
    })
    .catch(done)
  })

  it('should update a time claim', function (done) {
    this.timeout(20 * 1000)
    const property = 'P580'
    const oldValue = '0' + randomNumber(3) + '-02-26'
    const newValue = '0' + randomNumber(3) + '-02-26'
    addClaim(sandboxEntity, property, oldValue)
    .then(res1 => {
      return updateClaim(sandboxEntity, property, oldValue, newValue)
      .then(res2 => {
        res1.claim.id.should.equal(res2.claim.id)
        wdk.simplify.claim(res2.claim).split('T')[0].should.equal(newValue)
        done()
      })
    })
    .catch(done)
  })

  it('should update a time claim', function (done) {
    this.timeout(20 * 1000)
    const property = 'P1545'
    const oldValue = randomString(6)
    const newValue = randomString(6)
    addClaim(sandboxEntity, property, oldValue)
    .then(res1 => {
      return updateClaim(sandboxEntity, property, oldValue, newValue)
      .then(res2 => {
        res1.claim.id.should.equal(res2.claim.id)
        wdk.simplify.claim(res2.claim).should.equal(newValue)
        done()
      })
    })
    .catch(done)
  })
})
