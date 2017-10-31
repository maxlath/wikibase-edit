require('should')
const CONFIG = require('config')
const addReference = require('../../lib/reference/add')
const removeReference = require('../../lib/reference/remove')
const addClaim = require('../../lib/claim/add')
const { randomString, sandboxEntity } = require('../../lib/tests_utils')

const property = 'P2002'
const value = randomString()
const claimPromise = addClaim(CONFIG)(sandboxEntity, property, value)

describe('reference remove', () => {
  it('should be a function', done => {
    removeReference.should.be.a.Function()
    removeReference(CONFIG).should.be.a.Function()
    done()
  })

  it('should remove a reference', function (done) {
    this.timeout(20 * 1000)
    const referenceUrl = 'https://example.org/rise-and-fall-of-the-holy-sandbox-' + randomString()
    claimPromise
    .then(res => {
      const guid = res.claim.id
      return addReference(CONFIG)(guid, 'P854', referenceUrl)
      .then(res => {
        res.success.should.equal(1)
        const { hash: referenceHash } = res.reference
        return removeReference(CONFIG)(guid, referenceHash)
        .then(res => {
          res.success.should.equal(1)
          done()
        })
      })
    })
    .catch(done)
  })
})
