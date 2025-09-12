import 'should'
import { addAlias } from '#lib/alias/add'
import { assert, randomString, someEntityId } from '#tests/unit/utils'

const language = 'it'

describe('alias add', () => {
  it('should reject if not passed an entity id', () => {
    // @ts-expect-error
    addAlias.bind(null, {}).should.throw('invalid entity id')
  })

  it('should reject if not passed a language', () => {
    // @ts-expect-error
    addAlias.bind(null, { id: someEntityId }).should.throw('invalid language')
  })

  it('should reject if not passed an alias', () => {
    // @ts-expect-error
    addAlias.bind(null, { id: someEntityId, language }).should.throw('empty alias array')
  })

  it('should accept a single alias string', () => {
    const value = randomString()
    const { action, data } = addAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    assert('add' in data)
    data.add.should.deepEqual(value)
  })

  it('should accept multiple aliases as an array of strings', () => {
    const value = [ randomString(), randomString() ]
    const { action, data } = addAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    assert('add' in data)
    data.add.should.equal(value.join('|'))
  })
})
