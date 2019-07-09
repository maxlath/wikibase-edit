require('should')
const setAlias = require('../../lib/alias/set')
const { randomString, sandboxEntity } = require('../utils')
const language = 'it'

describe('alias set', () => {
  it('should reject if not passed an entity', done => {
    setAlias.bind(null, {}).should.throw('invalid entity')
    done()
  })

  it('should reject if not passed a language', done => {
    setAlias.bind(null, { id: sandboxEntity }).should.throw('invalid language')
    done()
  })

  it('should reject if not passed an alias', done => {
    setAlias.bind(null, { id: sandboxEntity, language }).should.throw('empty alias array')
    done()
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
