require('module-alias/register')
require('should')

const removeAlias = require('lib/alias/remove')
const { randomString, someEntityId } = require('test/unit/utils')
const language = 'it'

describe('alias remove', () => {
  it('should reject if not passed an entity', () => {
    removeAlias.bind(null, {}).should.throw('invalid entity')
  })

  it('should reject if not passed a language', () => {
    removeAlias.bind(null, { id: someEntityId }).should.throw('invalid language')
  })

  it('should reject if not passed an alias', () => {
    removeAlias.bind(null, { id: someEntityId, language }).should.throw('empty alias array')
  })

  it('should accept a single alias string', () => {
    // It's not necessary that the removed alias actually exist
    // so we can just pass a random string and expect Wikibase to deal with it
    const value = randomString()
    const { action, data } = removeAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.remove.should.equal(value)
  })

  it('should accept multiple aliases as an array of strings', () => {
    const value = [ randomString(), randomString() ]
    const { action, data } = removeAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.remove.should.equal(value.join('|'))
  })
})
