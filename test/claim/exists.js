require('should')
const exists = require('../../lib/claim/exists')
const { sandboxEntity } = require('../../lib/tests_utils')
const property = 'P2002'
const value = 'Zorg'

describe('claim exists', () => {
  it('should be a function', done => {
    exists.should.be.a.Function()
    exists().should.be.a.Function()
    done()
  })

  it('should rejected if not passed an entity', done => {
    exists()()
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
  })

  it('should rejected if not passed a property', done => {
    exists()(sandboxEntity)
    .catch(err => {
      err.message.should.equal('invalid property')
      done()
    })
  })

  it('should rejected if not passed a value', done => {
    exists()(sandboxEntity, property)
    .catch(err => {
      err.message.should.equal('missing value')
      done()
    })
  })

  // Using an non arrow key to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should return a boolean', function (done) {
    this.timeout(20 * 1000)
    exists()(sandboxEntity, property, value)
    .then(res => {
      res.should.be.a.Boolean()
      done()
    })
  })
})
