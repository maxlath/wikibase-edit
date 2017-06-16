require('should')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')
const _removeClaim = require('../../lib/claim/remove')
const removeClaim = _removeClaim(CONFIG)
const { randomString, sandboxEntity } = require('../../lib/tests_utils')

const getClaimGuid = () => {
  return addClaim(CONFIG)(sandboxEntity, 'P2002', randomString())
  .then(res => res.claim.id)
}

describe('claim remove', () => {
  it('should be a function', done => {
    _removeClaim.should.be.a.Function()
    removeClaim.should.be.a.Function()
    done()
  })

  // Using an non arrow key to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should remove a claim', function (done) {
    this.timeout(20 * 1000)
    getClaimGuid()
    .then(guid => {
      removeClaim(guid)
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
    Promise.all([ getClaimGuid(), getClaimGuid() ])
    .then(guids => {
      removeClaim(guids)
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
