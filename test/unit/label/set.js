require('should')
const { __ } = require('config')
const language = 'fr'
const setLabel = __.require('lib/label/set')
const { randomString, sandboxEntity } = __.require('test/unit/utils')

describe('label', () => {
  it('should throw if not passed an entity', done => {
    setLabel.bind(null, {}).should.throw('invalid entity')
    done()
  })

  it('should throw if not passed a language', done => {
    setLabel.bind(null, { id: sandboxEntity }).should.throw('invalid language')
    done()
  })

  it('should throw if not passed a label', done => {
    setLabel.bind(null, { id: sandboxEntity, language }).should.throw('missing label')
    done()
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
