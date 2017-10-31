require('should')
const CONFIG = require('config')
const addQualifier = require('../../lib/qualifier/add')(CONFIG)
const removeQualifier = require('../../lib/qualifier/remove')(CONFIG)
const addClaim = require('../../lib/claim/add')(CONFIG)
const { randomString, sandboxEntity } = require('../../lib/tests_utils')

const property = 'P2002'
const value = randomString()
const claimPromise = addClaim(sandboxEntity, property, value)

describe('qualifier remove', () => {
  it('should be a function', done => {
    removeQualifier.should.be.a.Function()
    done()
  })

  it('should remove a qualifier', function (done) {
    this.timeout(20 * 1000)
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
