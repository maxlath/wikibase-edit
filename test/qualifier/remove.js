require('should')
const CONFIG = require('config')
const addQualifier = require('../../lib/qualifier/add')(CONFIG)
const removeQualifier = require('../../lib/qualifier/remove')(CONFIG)
const { getClaimGuid } = require('../../lib/tests_utils')

var claimGuidPromise

describe('qualifier remove', function () {
  this.timeout(20 * 1000)

  before(function (done) {
    claimGuidPromise = getClaimGuid()
    done()
  })

  it('should be a function', done => {
    removeQualifier.should.be.a.Function()
    done()
  })

  it('should remove a qualifier', done => {
    claimGuidPromise
    .then(guid => {
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

  it('should remove a qualifier with a special snaktype', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P578', { snaktype: 'novalue' })
      .then(res => {
        const { hash: qualifierHash } = res.claim.qualifiers.P578.slice(-1)[0]
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
