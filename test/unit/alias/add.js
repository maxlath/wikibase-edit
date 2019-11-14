require('should')
const { __ } = require('config')
const addAlias = __.require('lib/alias/add')
const { randomString, someEntityId } = __.require('test/unit/utils')
const language = 'it'

describe('alias add', () => {
  it('should reject if not passed an entity', done => {
    addAlias.bind(null, {}).should.throw('invalid entity')
    done()
  })

  it('should reject if not passed a language', done => {
    addAlias.bind(null, { id: someEntityId }).should.throw('invalid language')
    done()
  })

  it('should reject if not passed an alias', done => {
    addAlias.bind(null, { id: someEntityId, language }).should.throw('empty alias array')
    done()
  })

  it('should accept a single alias string', done => {
    const value = randomString()
    const { action, data } = addAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.add.should.deepEqual(value)
    done()
  })

  it('should accept multiple aliases as an array of strings', done => {
    const value = [ randomString(), randomString() ]
    const { action, data } = addAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.add.should.deepEqual(value)
    done()
  })
})
