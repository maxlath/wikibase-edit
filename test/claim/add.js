require('should')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')
const { randomString, randomNumber, sandboxEntity } = require('../../lib/tests_utils')
const property = 'P2002'

describe('claim add', () => {
  it('should be a function', done => {
    addClaim.should.be.a.Function()
    addClaim(CONFIG).should.be.a.Function()
    done()
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should add a claim', function (done) {
    this.timeout(20 * 1000)
    const value = randomString()
    addClaim(CONFIG)(sandboxEntity, property, value)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })

  it('should add a claim with a reference if provided', function (done) {
    this.timeout(20 * 1000)
    const value = randomString()
    addClaim(CONFIG)(sandboxEntity, property, value, 'Q60856')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })

  it('should add a claim with an external id', function (done) {
    this.timeout(20 * 1000)
    addClaim(CONFIG)(sandboxEntity, 'P600', 'someid' + randomString(5))
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })

  it('should add a claim with an wikibase item', function (done) {
    this.timeout(20 * 1000)
    addClaim(CONFIG)(sandboxEntity, 'P50', 'Q627323' + randomNumber(2))
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })

  it('should add a claim with a year', function (done) {
    this.timeout(20 * 1000)
    addClaim(CONFIG)(sandboxEntity, 'P569', '1802')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })

  it('should add a claim with monolingualtext', function (done) {
    this.timeout(20 * 1000)
    addClaim(CONFIG)(sandboxEntity, 'P1476', [ 'bulgroz', 'fr' ])
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })

  it('should add a claim with a quantity', function (done) {
    this.timeout(20 * 1000)
    addClaim(CONFIG)(sandboxEntity, 'P1106', 9000)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })

  it('should add a claim with a WikibaseProperty', function (done) {
    this.timeout(20 * 1000)
    addClaim(CONFIG)(sandboxEntity, 'P1659', 'Q3576110' + randomNumber(2))
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })

  it('should add a claim with a Url', function (done) {
    this.timeout(20 * 1000)
    addClaim(CONFIG)(sandboxEntity, 'P2078', 'https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-claim')
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })
})
