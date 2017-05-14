require('should')
const CONFIG = require('config')
const setDescription = require('../../lib/description/set')
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const language = 'fr'

describe('description set', () => {
  it('should be a function', done => {
    setDescription.should.be.a.Function()
    setDescription(CONFIG).should.be.a.Function()
    done()
  })

  it('should rejected if not passed an entity', done => {
    setDescription(CONFIG)()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
  })

  it('should rejected if not passed a language', done => {
    setDescription(CONFIG)(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid language')
      done()
    })
  })

  it('should rejected if not passed a description', done => {
    setDescription(CONFIG)(sandboxEntity, language)
    .catch(err => {
      err.message.should.equal('invalid description')
      done()
    })
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should set a description', function (done) {
    this.timeout(20 * 1000)
    const description = `Bac à Sable (${randomString()})`
    setDescription(CONFIG)(sandboxEntity, 'fr', description)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
  })
})
