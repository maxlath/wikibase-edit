import 'should'
import { setDescription } from '../../../src/lib/description/set.js'
import { randomString, someEntityId } from '../utils.js'

const language = 'fr'

describe('description', () => {
  it('should throw if not passed an entity', () => {
    // @ts-expect-error
    setDescription.bind(null, {}).should.throw('invalid entity id')
  })

  it('should throw if not passed a language', () => {
    // @ts-expect-error
    setDescription.bind(null, { id: someEntityId }).should.throw('invalid language')
  })

  it('should throw if not passed a description', () => {
    // @ts-expect-error
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
