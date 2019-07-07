require('should')
const addQualifier = require('../../lib/qualifier/add')
const removeQualifier = require('../../lib/qualifier/remove')
const { getClaimGuid } = require('../utils')

var claimGuidPromise

describe('qualifier remove', () => {

  before(function (done) {
    claimGuidPromise = getClaimGuid()
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
