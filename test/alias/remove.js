require('should')
const CONFIG = require('config')
const removeAlias = require('../../lib/alias/remove')(CONFIG)
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const language = 'it'

describe('alias remove', function () {
  this.timeout(20 * 1000)

  it('should be a function', done => {
    removeAlias.should.be.a.Function()
    done()
  })

  it('should reject if not passed an entity', done => {
    removeAlias()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
    .catch(done)
  })

  it('should reject if not passed a language', done => {
    removeAlias(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid language')
      done()
    })
    .catch(done)
  })

  it('should reject if not passed an alias', done => {
    removeAlias(sandboxEntity, language)
    .catch(err => {
      err.message.should.equal('empty alias array')
      done()
    })
    .catch(done)
  })

  it('should accept a single alias string', done => {
    // It's not necessary that the removed alias actually exist
    // so we can just pass a random string and expect Wikidata to deal with it
    removeAlias(sandboxEntity, language, randomString(4))
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should accept multiple aliases as an array of strings', done => {
    removeAlias(sandboxEntity, language, [ randomString(4), randomString(4) ])
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should remove an alias', done => {
    const alias = `Bac à Sable (${randomString()})`
    removeAlias(sandboxEntity, 'fr', alias)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })
})
