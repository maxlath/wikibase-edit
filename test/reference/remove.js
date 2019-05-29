require('should')
const CONFIG = require('config')
const addReference = require('../../lib/reference/add')(CONFIG)
const removeReference = require('../../lib/reference/remove')(CONFIG)
const { randomString, getClaimGuid } = require('../../lib/tests_utils')

var claimGuidPromise

describe('reference remove', function () {
  this.timeout(20 * 1000)

  before(function (done) {
    claimGuidPromise = getClaimGuid()
    done()
  })

  it('should be a function', done => {
    removeReference.should.be.a.Function()
    done()
  })

  it('should remove a reference', done => {
    const referenceUrl = 'https://example.org/rise-and-fall-of-the-holy-sandbox-' + randomString()
    claimGuidPromise
    .then(guid => {
      return addReference(guid, 'P854', referenceUrl)
      .then(res => {
        res.success.should.equal(1)
        const { hash: referenceHash } = res.reference
        return removeReference(guid, referenceHash)
        .then(res => {
          res.success.should.equal(1)
          done()
        })
      })
    })
    .catch(done)
  })
})
