import 'should'
import setDescription from '#lib/description/set'
import { randomString, someEntityId } from '#tests/unit/utils'

const language = 'fr'

describe('description', () => {
  it('should throw if not passed an entity', () => {
    setDescription.bind(null, {}).should.throw('invalid entity')
  })

  it('should throw if not passed a language', () => {
    setDescription.bind(null, { id: someEntityId }).should.throw('invalid language')
  })

  it('should throw if not passed a description', () => {
    setDescription.bind(null, { id: someEntityId, language })
    .should.throw('missing description')
  })

  it('should return an action and data', () => {
    const value = `Bac à Sable (${randomString()})`
    const { action, data } = setDescription({ id: someEntityId, language, value })
    action.should.equal('wbsetdescription')
    data.id.should.equal(someEntityId)
    data.language.should.equal(language)
    data.value.should.equal(value)
  })
})
