require('should')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')(CONFIG)
const exists = require('../../lib/claim/exists')(CONFIG)
const remove = require('../../lib/claim/remove')(CONFIG)
const { randomString, sandboxEntity, sandboxStringProp } = require('../../lib/tests_utils')
const property = sandboxStringProp

const checkAndAddClaim = (subject, property, value) => {
  return exists(subject, property, value)
  .then(matchingClaimsGuids => {
    if (matchingClaimsGuids) return remove(matchingClaimsGuids)
  })
  .then(() => addClaim(subject, property, value))
}

describe('claim add', function () {
  this.timeout(20 * 1000)

  it('should be a function', done => {
    addClaim.should.be.a.Function()
    done()
  })

  it('should add a claim', done => {
    const value = randomString()
    checkAndAddClaim(sandboxEntity, property, value)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with an external id', done => {
    checkAndAddClaim(sandboxEntity, 'P600', 'someid')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with an wikibase item', done => {
    checkAndAddClaim(sandboxEntity, 'P50', 'Q627323')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a year', done => {
    checkAndAddClaim(sandboxEntity, 'P578', '1802')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a month', done => {
    checkAndAddClaim(sandboxEntity, 'P578', '1802-02')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a day', done => {
    checkAndAddClaim(sandboxEntity, 'P578', '1802-02-03')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a time claim with a low precision', done => {
    checkAndAddClaim(sandboxEntity, 'P578', { time: '2500000', precision: 4 })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  // Not implemented by the Wikidata API
  // it('should add a time claim with a high precision', done => {
  //   checkAndAddClaim(sandboxEntity, 'P578', { time: '1802-02-04T11:22:33Z', precision: 14 })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     done()
  //   })
  //   .catch(done)
  // })

  it('should reject a claim with an invalid time', done => {
    checkAndAddClaim(sandboxEntity, 'P578', '1802-22-33')
    .catch(err => {
      err.message.should.equal('invalid time value')
      done()
    })
  })

  it('should reject a claim with an invalid time (2)', done => {
    checkAndAddClaim(sandboxEntity, 'P578', '1802-02-04T11')
    .catch(err => {
      err.message.should.equal('invalid time value')
      done()
    })
  })

  it('should add a claim with monolingualtext', done => {
    checkAndAddClaim(sandboxEntity, 'P1476', { text: 'bulgroz', language: 'fr' })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a quantity', done => {
    checkAndAddClaim(sandboxEntity, 'P1106', 9000)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a quantity passed as a string', done => {
    checkAndAddClaim(sandboxEntity, 'P1106', '9001')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a quantity with a unit', done => {
    checkAndAddClaim(sandboxEntity, 'P1106', { amount: 9001, unit: 'Q7727' })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a negative amount', done => {
    checkAndAddClaim(sandboxEntity, 'P1106', -9001)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should throw when passed an invalid string number', done => {
    checkAndAddClaim(sandboxEntity, 'P1106', '900$1')
    .catch(err => {
      err.message.should.equal('invalid string number: 900$1')
      done()
    })
  })

  it('should add a claim with a Url', done => {
    checkAndAddClaim(sandboxEntity, 'P2078', 'https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-claim')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a globe coordinate', done => {
    checkAndAddClaim(sandboxEntity, 'P626', { latitude: 45.758, longitude: 4.84138, precision: 1 / 360 })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim of snaktype novalue', done => {
    checkAndAddClaim(sandboxEntity, 'P1106', { snaktype: 'novalue' })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim of snaktype somevalue', done => {
    checkAndAddClaim(sandboxEntity, 'P1106', { snaktype: 'somevalue' })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })
})
