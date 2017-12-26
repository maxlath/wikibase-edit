require('should')
const CONFIG = require('config')
const addQualifier = require('../../lib/qualifier/add')(CONFIG)
const removeQualifier = require('../../lib/qualifier/remove')(CONFIG)
const { getClaimPromise } = require('../../lib/tests_utils')

var claimPromise

describe('qualifier remove', function () {
  this.timeout(20 * 1000)

  before(function (done) {
    claimPromise = getClaimPromise()
    done()
  })

  it('should be a function', done => {
    removeQualifier.should.be.a.Function()
    done()
  })

  it('should remove a qualifier', done => {
    claimPromise
    .then(res => {
      const guid = res.claim.id
      return addQualifier(guid, 'P155', 'Q4115189')
      .then(res => {
        res.success.should.equal(1)
        const { hash: qualifierHash } = res.claim.qualifiers.P155[0]
        return removeQualifier(guid, qualifierHash)
        .then(res => {
          res.success.should.equal(1)
          done()
        })
      })
    })
    .catch(done)
  })
})
