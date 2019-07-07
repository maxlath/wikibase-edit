require('should')
const removeAlias = require('../../lib/alias/remove')
const { randomString, sandboxEntity } = require('../utils')
const language = 'it'

describe('alias remove', () => {
  it('should reject if not passed an entity', done => {
    try {
      removeAlias({})
    } catch (err) {
      err.message.should.equal('invalid entity')
      done()
    }
  })

  it('should reject if not passed a language', done => {
    try {
      removeAlias({ id: sandboxEntity })
    } catch (err) {
      err.message.should.equal('invalid language')
      done()
    }
  })

  it('should reject if not passed an alias', done => {
    try {
      removeAlias({ id: sandboxEntity, language })
    } catch (err) {
      err.message.should.equal('empty alias array')
      done()
    }
  })

  it('should accept a single alias string', done => {
    // It's not necessary that the removed alias actually exist
    // so we can just pass a random string and expect Wikidata to deal with it
    const value = randomString(4)
    const { action, data } = removeAlias({ id: sandboxEntity, language, value })
    done()
  })

  it('should accept multiple aliases as an array of strings', done => {
    const value = [ randomString(4), randomString(4) ]
    const { action, data } = removeAlias({ id: sandboxEntity, language, value })
    done()
  })
})
