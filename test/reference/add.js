require('should')
const CONFIG = require('config')
const addReference = require('../../lib/reference/add')(CONFIG)
const { randomString, getClaimGuid } = require('../../lib/tests_utils')

var claimGuidPromise

describe('reference add', function () {
  this.timeout(20 * 1000)

  before(function (done) {
    claimGuidPromise = getClaimGuid(done)
    done()
  })

  it('should be a function', done => {
    addReference.should.be.a.Function()
    done()
  })

  it('should rejected if not passed a claim guid', done => {
    addReference()
    .catch(err => {
      err.message.should.equal('missing guid')
      done()
    })
    .catch(done)
  })

  it('should rejected if passed an invalid claim guid', done => {
    addReference('some-invalid-guid')
    .catch(err => {
      err.message.should.equal('invalid guid')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a property', done => {
    claimGuidPromise
    .then(guid => {
      return addReference(guid)
      .catch(err => {
        err.message.should.equal('missing property')
        done()
      })
    })
    .catch(done)
  })

  // (1)
  it('should rejected if not passed a reference value', done => {
    claimGuidPromise
    .then(guid => {
      return addReference(guid, 'P143')
      .catch(err => {
        err.message.should.equal('missing reference value')
        done()
      })
    })
    .catch(done)
  })

  it('should rejected if passed an invalid reference', done => {
    claimGuidPromise
    .then(guid => {
      return addReference(guid, 'P143', 'not-a-valid-reference')
      .catch(err => {
        err.message.should.equal('invalid entity value')
        done()
      })
    })
    .catch(done)
  })

  it('should add a reference', done => {
    const referenceUrl = 'https://example.org/rise-and-fall-of-the-holy-sandbox-' + randomString()
    claimGuidPromise
    .then(guid => {
      return addReference(guid, 'P854', referenceUrl)
      .then(res => {
        res.success.should.equal(1)
        done()
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
        res.reference.snaks.P369[0].snaktype.should.equal('somevalue')
        done()
      })
    })
    .catch(done)
  })
})
