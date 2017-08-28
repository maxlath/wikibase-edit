require('should')
const CONFIG = require('config')
const createEntity = require('../../lib/entity/create')

describe('entity edit', () => {
  it('should be a function', done => {
    createEntity.should.be.a.Function()
    createEntity(CONFIG).should.be.a.Function()
    done()
  })

  it('should then use entity.edit validation features', done => {
    createEntity(CONFIG)({ claims: { P31: 'bla' } })
    .catch(err => {
      err.message.should.equal('invalid claim value')
      done()
    })
    .catch(done)
  })
})

// Not testing more as data validation is done by entity.edit tests
// and checking that everything works would involved creating new entities
// on Wikidata, just for the sake of tests, which is probably not welcome
