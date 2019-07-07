require('should')
const language = 'fr'
const setLabel = require('../../lib/label/set')
const { randomString, sandboxEntity } = require('../utils')

describe('label', () => {
  it('should throw if not passed an entity', done => {
    try{
      setLabel({})
    } catch (err) {
      err.message.should.equal('invalid entity')
      done()
    }
  })

  it('should throw if not passed a language', done => {
    try{
      setLabel({ id: sandboxEntity })
    } catch (err) {
      err.message.should.equal('invalid language')
      done()
    }
  })

  it('should throw if not passed a label', done => {
    try{
      setLabel({ id: sandboxEntity, language })
    } catch (err) {
      err.message.should.equal('missing label')
      done()
    }
  })

  it('should return an action and data', done => {
    const value = `Bac à Sable (${randomString()})`
    const { action, data } = setLabel({ id: sandboxEntity, language, value })
    action.should.equal('wbsetlabel')
    data.id.should.equal(sandboxEntity)
    data.language.should.equal(language)
    data.value.should.equal(value)
    done()
  })
})
