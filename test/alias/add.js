require('should')
const CONFIG = require('config')
const addAlias = require('../../lib/alias/add')(CONFIG)
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const language = 'it'

describe('alias add', () => {
  it('should be a function', done => {
    addAlias.should.be.a.Function()
    done()
  })

  it('should reject if not passed an entity', done => {
    addAlias()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
    .catch(done)
  })

  it('should reject if not passed a language', done => {
    addAlias(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid language')
      done()
    })
    .catch(done)
  })

  it('should reject if not passed an alias', done => {
    addAlias(sandboxEntity, language)
    .catch(err => {
      err.message.should.equal('empty alias array')
      done()
    })
    .catch(done)
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should accept a single alias string', function (done) {
    this.timeout(20 * 1000)
    addAlias(sandboxEntity, language, randomString(4))
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should accept multiple aliases as an array of strings', function (done) {
    this.timeout(20 * 1000)
    addAlias(sandboxEntity, language, [ randomString(4), randomString(4) ])
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should add an alias', function (done) {
    this.timeout(20 * 1000)
    const alias = `Bac à Sable (${randomString()})`
    addAlias(sandboxEntity, 'fr', alias)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })
})
