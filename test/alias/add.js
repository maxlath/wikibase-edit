require('should')
const addAlias = require('../../lib/alias/add')
const { randomString, sandboxEntity } = require('../utils')
const language = 'it'

describe('alias add', () => {
  it('should reject if not passed an entity', done => {
    try {
      addAlias({})
    } catch (err) {
      err.message.should.equal('invalid entity')
      done()
    }
  })

  it('should reject if not passed a language', done => {
    try {
      addAlias({ id: sandboxEntity })
    } catch (err) {
      err.message.should.equal('invalid language')
      done()
    }
  })

  it('should reject if not passed an alias', done => {
    try {
      addAlias({ id: sandboxEntity, language })
    } catch (err) {
      err.message.should.equal('empty alias array')
      done()
    }
  })

  it('should accept a single alias string', done => {
    const value = randomString(4)
    const { action, data } = addAlias({ id: sandboxEntity, language, value })
    done()
  })

  it('should accept multiple aliases as an array of strings', done => {
    const value = [ randomString(4), randomString(4) ]
    const { action, data } = addAlias({ id: sandboxEntity, language, value })
    done()
  })
})
