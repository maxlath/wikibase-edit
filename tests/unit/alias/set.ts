import 'should'
import { setAlias } from '#lib/alias/set'
import { assert, randomString, someEntityId } from '#tests/unit/utils'

const language = 'it'

describe('alias set', () => {
  it('should reject if not passed an entity', () => {
    // @ts-expect-error
    setAlias.bind(null, {}).should.throw('invalid entity')
  })

  it('should reject if not passed a language', () => {
    // @ts-expect-error
    setAlias.bind(null, { id: someEntityId }).should.throw('invalid language')
  })

  it('should reject if not passed an alias', () => {
    // @ts-expect-error
    setAlias.bind(null, { id: someEntityId, language }).should.throw('empty alias array')
  })

  it('should accept a single alias string', () => {
    const value = randomString()
    const { action, data } = setAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    data.should.be.an.Object()
  })

  it('should accept multiple aliases as an array of strings', () => {
    const value = [ randomString(), randomString() ]
    const { action, data } = setAlias({ id: someEntityId, language, value })
    action.should.equal('wbsetaliases')
    assert('set' in data)
    data.set.should.equal(value.join('|'))
  })
})
