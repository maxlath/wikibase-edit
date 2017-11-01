require('should')
const CONFIG = require('config')
const removeClaim = require('../../lib/claim/remove')(CONFIG)
const { getClaimGuid } = require('../../lib/tests_utils')

var claimGuidA, claimGuidB, claimGuidC

describe('claim remove', () => {
  before(function (done) {
    this.timeout(20 * 1000)
    claimGuidA = getClaimGuid()

    claimGuidA
    .then(() => {
      // Wait for the first claim to be created to avoid edit conflicts
      claimGuidB = getClaimGuid()

      claimGuidB
      .then(() => {
        claimGuidC = getClaimGuid()
        done()
      })
    })
  })

  it('should be a function', done => {
    removeClaim.should.be.a.Function()
    done()
  })

  // Using an non arrow key to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should remove a claim', function (done) {
    this.timeout(20 * 1000)
    claimGuidA
    .then(guid => {
      return removeClaim(guid)
      .then(res => {
        res.success.should.equal(1)
        res.claims[0].should.equal(guid)
        done()
      })
    })
    .catch(done)
  })

  it('should several claims', function (done) {
    this.timeout(20 * 1000)
    Promise.all([ claimGuidB, claimGuidC ])
    .then(guids => {
      return removeClaim(guids)
      .then(res => {
        res.success.should.equal(1)
        res.claims[0].should.equal(guids[0])
        res.claims[1].should.equal(guids[1])
        done()
      })
    })
    .catch(done)
  })
})
