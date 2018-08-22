require('should')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')(CONFIG)
const addReference = require('../../lib/reference/add')(CONFIG)
const updateClaim = require('../../lib/claim/update')(CONFIG)
const { randomString, randomNumber, sandboxEntity, sandboxStringProp, undesiredRes } = require('../../lib/tests_utils')
const wdk = require('wikidata-sdk')

describe('claim update', function () {
  this.timeout(20 * 1000)

  it('should be a function', done => {
    updateClaim.should.be.a.Function()
    done()
  })

  it('should reject if old value is missing', done => {
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

  it('should update a claim', done => {
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

  it('should reject claim updates from values when several claims match', done => {
    const oldValue = randomString()
    const newValue = randomString()
    addClaim(sandboxEntity, sandboxStringProp, oldValue)
    .then(res1 => {
      const options = { allowDuplicates: true }
      return addClaim(sandboxEntity, sandboxStringProp, oldValue, options)
    })
    .then(res2 => updateClaim(sandboxEntity, sandboxStringProp, oldValue, newValue))
    .then(undesiredRes(done))
    .catch(err => {
      err.message.should.equal('snak not found: too many matching snaks')
      done()
    })
    .catch(done)
  })

  it('should keep the references and qualifiers', done => {
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

  it('should update a monolingual text claim', done => {
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

  it('should update a quantity claim with a unit', done => {
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

  it('should update a time claim', done => {
    const property = 'P580'
    const oldValue = '1' + randomNumber(3) + '-02-26'
    const newValue = '1' + randomNumber(3) + '-02-26'
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

  it('should update a time claim', done => {
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

  it('should update a globecoordinate claim', done => {
    const property = 'P626'
    const oldValue = {
      latitude: randomNumber(2),
      longitude: randomNumber(2),
      precision: 0.01,
      globe: 'http://www.wikidata.org/entity/Q111'
    }
    const newValue = Object.assign({}, oldValue, {
      globe: 'http://www.wikidata.org/entity/Q112'
    })
    addClaim(sandboxEntity, property, oldValue)
    .then(res1 => {
      return updateClaim(sandboxEntity, property, oldValue, newValue)
      .then(res2 => {
        res1.claim.id.should.equal(res2.claim.id)
        res2.claim.mainsnak.datavalue.value.globe.should.equal('http://www.wikidata.org/entity/Q112')
        done()
      })
    })
    .catch(done)
  })

  it('should update a claim from a guid', done => {
    const property = 'P370'
    const oldValue = randomString(6)
    const newValue = randomString(6)
    addClaim(sandboxEntity, property, oldValue)
    .then(res1 => {
      return updateClaim(res1.claim.id, newValue)
      .then(res2 => {
        res1.claim.id.should.equal(res2.claim.id)
        wdk.simplify.claim(res2.claim).should.equal(newValue)
        done()
      })
    })
    .catch(done)
  })
})
