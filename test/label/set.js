require('should')
const CONFIG = require('config')
const setLabel = require('../../lib/label/set')(CONFIG)
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const language = 'fr'

describe('label set', function () {
  this.timeout(20 * 1000)

  it('should be a function', done => {
    setLabel.should.be.a.Function()
    done()
  })

  it('should rejected if not passed an entity', done => {
    setLabel()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a language', done => {
    setLabel(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid language')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a label', done => {
    setLabel(sandboxEntity, language)
    .catch(err => {
      err.message.should.equal('missing label')
      done()
    })
    .catch(done)
  })

  it('should set a label', done => {
    const label = `Bac à Sable (${randomString()})`
    setLabel(sandboxEntity, 'fr', label)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })
})
