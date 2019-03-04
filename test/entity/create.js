require('should')
const CONFIG = Object.assign({}, require('config'), {
  wikibaseInstance: 'https://test.wikidata.org/w/api.php',
  // Override what might have been defined on the require('config') object
  API: null
})
const createEntity = require('../../lib/entity/create')(CONFIG)
const { randomString } = require('../../lib/tests_utils')
const wdk = require('wikidata-sdk')

describe('entity create', function () {
  this.timeout(20 * 1000)

  it('should be a function', done => {
    createEntity.should.be.a.Function()
    done()
  })

  it('should then use entity.edit validation features', done => {
    createEntity({ claims: { P31: 'bla' } })
    .catch(err => {
      err.message.should.equal('invalid entity value')
      done()
    })
    .catch(done)
  })

  it('should create an entity', done => {
    const label = `wikidata-edit entity.create test (${randomString()})`
    const description = randomString()
    createEntity({
      labels: { en: label },
      aliases: { fr: randomString(), en: [ randomString() ] },
      descriptions: { fr: description },
      claims: { P17: 'Q166376' }
    })
    .then(res => {
      res.success.should.equal(1)
      wdk.isItemId(res.entity.id).should.be.true()
      res.entity.labels.en.value.should.equal(label)
      res.entity.descriptions.fr.value.should.equal(description)
      wdk.simplify.claim(res.entity.claims.P17[0]).should.equal('Q166376')
      done()
    })
    .catch(done)
  })
})

// Not testing more as data validation is done by entity.edit tests
// and checking that everything works would involved creating new entities
// on Wikidata, just for the sake of tests, which is probably not welcome
