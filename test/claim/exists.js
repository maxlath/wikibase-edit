require('should')
const CONFIG = require('config')
const exists = require('../../lib/claim/exists')
const { sandboxEntity } = require('../../lib/tests_utils')
const property = 'P2002'
const value = 'Zorg'

describe('claim exists', () => {
  it('should be a function', done => {
    exists.should.be.a.Function()
    exists(CONFIG).should.be.a.Function()
    done()
  })

  it('should rejected if not passed an entity', done => {
    exists(CONFIG)()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
  })

  it('should rejected if not passed a property', done => {
    exists(CONFIG)(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid property')
      done()
    })
  })

  it('should rejected if not passed a value', done => {
    exists(CONFIG)(sandboxEntity, property)
    .catch(err => {
      err.message.should.equal('missing claim value')
      done()
    })
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should return a boolean', function (done) {
    this.timeout(20 * 1000)
    exists(CONFIG)(sandboxEntity, property, value)
    .then(res => {
      res.should.be.a.Boolean()
      done()
    })
  })
})
