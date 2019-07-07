require('should')
const setAlias = require('../../lib/alias/set')
const { randomString, sandboxEntity } = require('../utils')
const language = 'it'

describe('alias set', () => {
  it('should reject if not passed an entity', done => {
    try {
      setAlias({})
    } catch (err) {
      err.message.should.equal('invalid entity')
      done()
    }
  })

  it('should reject if not passed a language', done => {
    try{
      setAlias({ id: sandboxEntity })
    } catch (err) {
      err.message.should.equal('invalid language')
      done()
    }
  })

  it('should reject if not passed an alias', done => {
    try{
      setAlias({ id: sandboxEntity, language })
    } catch (err) {
      err.message.should.equal('empty alias array')
      done()
    }
  })

  it('should accept a single alias string', done => {
    const value = randomString(4)
    const { action, data } = setAlias({ id: sandboxEntity, language, value })
    done()
  })

  it('should accept multiple aliases as an array of strings', done => {
    const value = [ randomString(4), randomString(4) ]
    const { action, data } = setAlias({ id: sandboxEntity, language, value })
    done()
  })
})
