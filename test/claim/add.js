require('should')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')
const randomString = () => Math.random().toString(36).slice(2, 10)
const entity = 'Q4115189'
const property = 'P2002'

describe('claim add', () => {
  it('should be a function', done => {
    addClaim.should.be.a.Function()
    addClaim(CONFIG).should.be.a.Function()
    done()
  })

  // Using an non arrow key to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should add a claim', function () {
    this.timeout(20 * 1000)
    const value = randomString()
    return addClaim(CONFIG)(entity, property, value)
    .then(res => {
      res.success.should.equal(1)
    })
    .catch(err => {
      throw err
    })
  })

  it('should add a claim with a reference if provided', function () {
    this.timeout(20 * 1000)
    const value = randomString()
    return addClaim(CONFIG)(entity, property, value, 'Q60856')
    .then(res => {
      res.success.should.equal(1)
    })
  })
})
