require('should')
const CONFIG = require('config')
const setAlias = require('../../lib/alias/set')
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const language = 'it'

describe('alias set', () => {
  it('should be a function', done => {
    setAlias.should.be.a.Function()
    setAlias(CONFIG).should.be.a.Function()
    done()
  })

  it('should reject if not passed an entity', done => {
    setAlias(CONFIG)()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
    .catch(done)
  })

  it('should reject if not passed a language', done => {
    setAlias(CONFIG)(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid language')
      done()
    })
    .catch(done)
  })

  it('should reject if not passed an alias', done => {
    setAlias(CONFIG)(sandboxEntity, language)
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
    setAlias(CONFIG)(sandboxEntity, language, randomString(4))
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should accept multiple aliases as an array of strings', function (done) {
    this.timeout(20 * 1000)
    setAlias(CONFIG)(sandboxEntity, language, [ randomString(4), randomString(4) ])
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should set an alias', function (done) {
    this.timeout(20 * 1000)
    const alias = `Bac à Sable (${randomString()})`
    setAlias(CONFIG)(sandboxEntity, 'fr', alias)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })
})
