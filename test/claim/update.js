require('should')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')(CONFIG)
const _updateClaim = require('../../lib/claim/update')
const updateClaim = _updateClaim(CONFIG)
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const wdk = require('wikidata-sdk')
const property = 'P2002'

describe('claim update', () => {
  it('should be a function', done => {
    _updateClaim.should.be.a.Function()
    updateClaim.should.be.a.Function()
    done()
  })

  it('should reject if old value is missing', function (done) {
    this.timeout(20 * 1000)
    const oldValue = randomString()
    const newValue = randomString()
    updateClaim(sandboxEntity, 'P2002', oldValue, newValue)
    .catch(err => {
      // Accept both messages as the sandbox entity might have been cleaned
      // and no pre-existing P2002 claim exist
      const possibleMessages = [
        'no property claims found',
        'no existing claim found for this value'
      ]
      possibleMessages.includes(err.message).should.be.true()
      done()
    })
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should update a claim', function (done) {
    this.timeout(20 * 1000)
    const oldValue = randomString()
    const newValue = randomString()
    addClaim(sandboxEntity, property, oldValue)
    .then(res1 => {
      updateClaim(sandboxEntity, 'P2002', oldValue, newValue)
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
    addClaim(sandboxEntity, property, oldValue, 'Q328')
    .then(res1 => {
      updateClaim(sandboxEntity, 'P2002', oldValue, newValue)
      .then(res2 => {
        res1.reference.hash.should.equal(res2.claim.references[0].hash)
        done()
      })
    })
    .catch(done)
  })
})
