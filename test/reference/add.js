require('should')
const CONFIG = require('config')
const addReference = require('../../lib/reference/add')
const addClaim = require('../../lib/claim/add')
const { randomString } = require('../../lib/tests_utils')

describe('claim add', () => {
  it('should be a function', done => {
    addReference.should.be.a.Function()
    addReference(CONFIG).should.be.a.Function()
    done()
  })

  // Using an non arrow key to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should add a reference', function (done) {
    this.timeout(20 * 1000)
    const entity = 'Q4115189'
    const property = 'P2002'
    const value = randomString()
    const referenceUrl = 'https://example.org/rise-and-box-of-the-holy-sand-box'
    addClaim(CONFIG)(entity, property, value)
    .then(res => {
      const guid = res.claim.id
      addReference(CONFIG)(guid, referenceUrl)
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
  })
})
