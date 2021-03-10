require('should')

const addAlias = require('lib/alias/add')
const { randomString, someEntityId } = require('test/unit/utils')
const language = 'it'

describe('alias add', () => {
  it('should reject if not passed an entity', () => {
    addAlias.bind(null, {}).should.throw('invalid entity')
  })

  it('should reject if not passed a language', () => {
    addAlias.bind(null, { id: someEntityId }).should.throw('invalid language')
  })

  it('should reject if not passed an alias', () => {
    addAlias.bind(null, { id: someEntityId, language }).should.throw('empty alias array')
  })

  it('should accept a single alias string', () => {
    const value = randomString()
    const { action, data } = addAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.add.should.deepEqual(value)
  })

  it('should accept multiple aliases as an array of strings', () => {
    const value = [ randomString(), randomString() ]
    const { action, data } = addAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.add.should.equal(value.join('|'))
  })
})
