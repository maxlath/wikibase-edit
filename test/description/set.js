require('should')
const language = 'fr'
const setDescription = require('../../lib/description/set')
const { randomString, sandboxEntity } = require('../utils')

describe('description', () => {
  it('should throw if not passed an entity', done => {
    try{
      setDescription({})
    } catch (err) {
      err.message.should.equal('invalid entity')
      done()
    }
  })

  it('should throw if not passed a language', done => {
    try{
      setDescription({ id: sandboxEntity })
    } catch (err) {
      err.message.should.equal('invalid language')
      done()
    }
  })

  it('should throw if not passed a description', done => {
    try{
      setDescription({ id: sandboxEntity, language })
    } catch (err) {
      err.message.should.equal('missing description')
      done()
    }
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
