require('should')
const CONFIG = require('config')
const _addClaim = require('../../lib/claim/add')
const addClaim = _addClaim(CONFIG)
const exists = require('../../lib/claim/exists')(CONFIG)
const remove = require('../../lib/claim/remove')(CONFIG)
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const property = 'P2002'

const checkAndAddClaim = (subject, property, object) => {
  return exists(subject, property, object)
  .then(matchingClaimsGuids => {
    if (matchingClaimsGuids) return remove(matchingClaimsGuids)
  })
  .then(() => addClaim(subject, property, object))
}

describe('claim add', () => {
  it('should be a function', done => {
    _addClaim.should.be.a.Function()
    addClaim.should.be.a.Function()
    done()
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should add a claim', function (done) {
    this.timeout(20 * 1000)
    const value = randomString()
    checkAndAddClaim(sandboxEntity, property, value)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with an external id', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P600', 'someid')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with an wikibase item', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P50', 'Q627323')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a year', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P569', '1802')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a month', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P569', '1802-02')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a day', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P569', '1802-02-03')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should reject a claim with an invalid time', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P569', '1802-22-33')
    .catch(err => {
      err.message.should.equal('invalid time value')
      done()
    })
  })

  it('should add a claim with monolingualtext', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P1476', [ 'bulgroz', 'fr' ])
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a quantity', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P1106', 9000)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add a claim with a quantity passed as a string', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P1106', '9001')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should throw when passed an invalid string number', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P1106', '900$1')
    .catch(err => {
      err.message.should.equal('invalid string number: 900$1')
      done()
    })
  })

  it('should add a claim with a Url', function (done) {
    this.timeout(20 * 1000)
    checkAndAddClaim(sandboxEntity, 'P2078', 'https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-claim')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })
})
