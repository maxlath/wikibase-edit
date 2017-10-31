require('should')
const CONFIG = require('config')
const addQualifier = require('../../lib/qualifier/add')
const addClaim = require('../../lib/claim/add')
const { randomString, sandboxEntity } = require('../../lib/tests_utils')

const property = 'P2002'
const value = randomString()
const claimGuidPromise = addClaim(CONFIG)(sandboxEntity, property, value)
  .then(res => res.claim.id)

describe('reference add', () => {
  it('should be a function', done => {
    addQualifier.should.be.a.Function()
    addQualifier(CONFIG).should.be.a.Function()
    done()
  })

  it('should rejected if not passed a claim guid', done => {
    addQualifier(CONFIG)()
    .catch(err => {
      err.message.should.equal('missing guid')
      done()
    })
    .catch(done)
  })

  it('should rejected if passed an invalid claim guid', done => {
    addQualifier(CONFIG)('some-invalid-guid')
    .catch(err => {
      err.message.should.equal('invalid guid')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a property', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      return addQualifier(CONFIG)(guid)
      .catch(err => {
        err.message.should.equal('missing property')
        done()
      })
    })
    .catch(done)
  })

  it('should rejected if not passed a value', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      return addQualifier(CONFIG)(guid, 'P155')
      .catch(err => {
        err.message.should.equal('missing qualifier value')
        done()
      })
    })
    .catch(done)
  })

  it('should rejected if passed an invalid value', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      return addQualifier(CONFIG)(guid, 'P155', 'not-a-valid-value')
      .catch(err => {
        err.message.should.equal('invalid entity value')
        done()
      })
    })
    .catch(done)
  })

  it('should add an entity qualifier', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      return addQualifier(CONFIG)(guid, 'P155', 'Q4115189')
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a string qualifier', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      return addQualifier(CONFIG)(guid, 'P1545', '123')
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a time qualifier', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      return addQualifier(CONFIG)(guid, 'P580', '1802-02')
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a quantity qualifier', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      return addQualifier(CONFIG)(guid, 'P2130', 123)
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add a monolingualtext qualifier', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      return addQualifier(CONFIG)(guid, 'P3132', [ "les sanglots long des violons de l'automne", 'fr' ])
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })
})
