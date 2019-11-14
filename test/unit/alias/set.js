require('should')
const { __ } = require('config')
const setAlias = __.require('lib/alias/set')
const { randomString, someEntityId } = __.require('test/unit/utils')
const language = 'it'

describe('alias set', () => {
  it('should reject if not passed an entity', done => {
    setAlias.bind(null, {}).should.throw('invalid entity')
    done()
  })

  it('should reject if not passed a language', done => {
    setAlias.bind(null, { id: someEntityId }).should.throw('invalid language')
    done()
  })

  it('should reject if not passed an alias', done => {
    setAlias.bind(null, { id: someEntityId, language }).should.throw('empty alias array')
    done()
  })

  it('should accept a single alias string', done => {
    const value = randomString()
    const { action, data } = setAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.should.be.an.Object()
    done()
  })

  it('should accept multiple aliases as an array of strings', done => {
    const value = [ randomString(), randomString() ]
    const { action, data } = setAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.should.be.an.Object()
    done()
  })
})
