require('should')
const removeAlias = require('../../lib/alias/remove')
const { randomString, sandboxEntity } = require('../utils')
const language = 'it'

describe('alias remove', () => {
  it('should reject if not passed an entity', done => {
    removeAlias.bind(null, {}).should.throw('invalid entity')
    done()
  })

  it('should reject if not passed a language', done => {
    removeAlias.bind(null, { id: sandboxEntity }).should.throw('invalid language')
    done()
  })

  it('should reject if not passed an alias', done => {
    removeAlias.bind(null, { id: sandboxEntity, language }).should.throw('empty alias array')
    done()
  })

  it('should accept a single alias string', done => {
    // It's not necessary that the removed alias actually exist
    // so we can just pass a random string and expect Wikidata to deal with it
    const value = randomString()
    const { action, data } = removeAlias({ id: sandboxEntity, language, value })
    done()
  })

  it('should accept multiple aliases as an array of strings', done => {
    const value = [ randomString(), randomString() ]
    const { action, data } = removeAlias({ id: sandboxEntity, language, value })
    done()
  })
})
