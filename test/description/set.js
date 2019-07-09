require('should')
const language = 'fr'
const setDescription = require('../../lib/description/set')
const { randomString, sandboxEntity } = require('../utils')

describe('description', () => {
  it('should throw if not passed an entity', done => {
    setDescription.bind(null, {}).should.throw('invalid entity')
    done()
  })

  it('should throw if not passed a language', done => {
    setDescription.bind(null, { id: sandboxEntity }).should.throw('invalid language')
    done()
  })

  it('should throw if not passed a description', done => {
    setDescription.bind(null, { id: sandboxEntity, language })
    .should.throw('missing description')
    done()
  })

  it('should return an action and data', done => {
    const value = `Bac à Sable (${randomString()})`
    const { action, data } = setDescription({ id: sandboxEntity, language, value })
    action.should.equal('wbsetdescription')
    data.id.should.equal(sandboxEntity)
    data.language.should.equal(language)
    data.value.should.equal(value)
    done()
  })
})
