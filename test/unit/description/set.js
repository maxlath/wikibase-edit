require('should')
const { __ } = require('config')
const language = 'fr'
const setDescription = __.require('lib/description/set')
const { randomString, someEntityId } = __.require('test/unit/utils')

describe('description', () => {
  it('should throw if not passed an entity', done => {
    setDescription.bind(null, {}).should.throw('invalid entity')
    done()
  })

  it('should throw if not passed a language', done => {
    setDescription.bind(null, { id: someEntityId }).should.throw('invalid language')
    done()
  })

  it('should throw if not passed a description', done => {
    setDescription.bind(null, { id: someEntityId, language })
    .should.throw('missing description')
    done()
  })

  it('should return an action and data', done => {
    const value = `Bac à Sable (${randomString()})`
    const { action, data } = setDescription({ id: someEntityId, language, value })
    action.should.equal('wbsetdescription')
    data.id.should.equal(someEntityId)
    data.language.should.equal(language)
    data.value.should.equal(value)
    done()
  })
})
