require('should')
const CONFIG = require('config')
const addQualifier = require('../../lib/qualifier/add')(CONFIG)
const { getClaimGuid } = require('../../lib/tests_utils')

var claimGuidPromise

describe('qualifier add', function () {
  this.timeout(20 * 1000)

  before(function (done) {
    claimGuidPromise = getClaimGuid()
    done()
  })

  it('should be a function', done => {
    addQualifier.should.be.a.Function()
    done()
  })

  it('should rejected if not passed a claim guid', done => {
    addQualifier()
    .catch(err => {
      err.message.should.equal('missing guid')
      done()
    })
    .catch(done)
  })

  it('should rejected if passed an invalid claim guid', done => {
    addQualifier('some-invalid-guid')
    .catch(err => {
      err.message.should.equal('invalid guid')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a property', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid)
      .catch(err => {
        err.message.should.equal('missing property')
        done()
      })
    })
    .catch(done)
  })

  it('should rejected if not passed a value', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P155')
      .catch(err => {
        err.message.should.equal('missing qualifier value')
        done()
      })
    })
    .catch(done)
  })

  it('should rejected if passed an invalid value', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P155', 'not-a-valid-value')
      .catch(err => {
        err.message.should.equal('invalid entity value')
        done()
      })
    })
    .catch(done)
  })

  it('should add an entity qualifier', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P155', 'Q4115189')
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a string qualifier', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P1545', '123')
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a time qualifier', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P580', '1802-02')
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a time qualifier with precision', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P580', { time: '1802-02', precision: 10 })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a quantity qualifier', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P2130', { amount: 123, unit: 'Q4916' })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a monolingualtext qualifier', done => {
    claimGuidPromise
    .then(guid => {
      return addQualifier(guid, 'P3132', { text: "les sanglots long des violons de l'automne", language: 'fr' })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })
})
