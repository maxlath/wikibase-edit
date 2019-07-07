require('should')
const addReference = require('../../lib/reference/add')
const removeReference = require('../../lib/reference/remove')
const { randomString, getClaimGuid } = require('../utils')

var claimGuidPromise

describe('reference remove', () => {

  before(function (done) {
    claimGuidPromise = getClaimGuid()
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

  it('should add a reference with a special snaktype', done => {
    claimGuidPromise
    .then(guid => {
      return addReference(guid, 'P369', { snaktype: 'somevalue' })
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
