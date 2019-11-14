require('should')
const { __ } = require('config')
const language = 'fr'
const setLabel = __.require('lib/label/set')
const { randomString, someEntityId } = __.require('test/unit/utils')

describe('label', () => {
  it('should throw if not passed an entity', done => {
    setLabel.bind(null, {}).should.throw('invalid entity')
    done()
  })

  it('should throw if not passed a language', done => {
    setLabel.bind(null, { id: someEntityId }).should.throw('invalid language')
    done()
  })

  it('should throw if not passed a label', done => {
    setLabel.bind(null, { id: someEntityId, language }).should.throw('missing label')
    done()
  })

  it('should return an action and data', done => {
    const value = `Bac à Sable (${randomString()})`
    const { action, data } = setLabel({ id: someEntityId, language, value })
    action.should.equal('wbsetlabel')
    data.id.should.equal(someEntityId)
    data.language.should.equal(language)
    data.value.should.equal(value)
    done()
  })
})
