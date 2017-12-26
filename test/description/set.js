require('should')
const CONFIG = require('config')
const setDescription = require('../../lib/description/set')(CONFIG)
const { randomString, sandboxEntity } = require('../../lib/tests_utils')
const language = 'fr'

describe('description set', function () {
  this.timeout(20 * 1000)

  it('should be a function', done => {
    setDescription.should.be.a.Function()
    setDescription.should.be.a.Function()
    done()
  })

  it('should rejected if not passed an entity', done => {
    setDescription()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a language', done => {
    setDescription(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid language')
      done()
    })
    .catch(done)
  })

  it('should rejected if not passed a description', done => {
    setDescription(sandboxEntity, language)
    .catch(err => {
      err.message.should.equal('invalid description')
      done()
    })
    .catch(done)
  })

  it('should set a description', done => {
    const description = `Bac à Sable (${randomString()})`
    setDescription(sandboxEntity, 'fr', description)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })
})
