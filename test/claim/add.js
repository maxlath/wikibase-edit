require('should')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
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
})
