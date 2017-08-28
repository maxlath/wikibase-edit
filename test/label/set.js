require('should')
const CONFIG = require('config')
const setLabel = require('../../lib/label/set')
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const language = 'fr'

describe('label set', () => {
  it('should be a function', done => {
    setLabel.should.be.a.Function()
    setLabel(CONFIG).should.be.a.Function()
    done()
  })

  it('should rejected if not passed an entity', done => {
    setLabel(CONFIG)()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a language', done => {
    setLabel(CONFIG)(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid language')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a label', done => {
    setLabel(CONFIG)(sandboxEntity, language)
    .catch(err => {
      err.message.should.equal('invalid label')
      done()
    })
    .catch(done)
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should set a label', function (done) {
    this.timeout(20 * 1000)
    const label = `Bac à Sable (${randomString()})`
    setLabel(CONFIG)(sandboxEntity, 'fr', label)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })
})
