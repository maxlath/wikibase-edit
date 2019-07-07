require('should')
const CONFIG = Object.assign({}, require('config'), {
  wikibaseInstance: 'https://test.wikidata.org/w/api.php',
  // Override what might have been defined on the require('config') object
  API: null
})
const createEntity = require('../../lib/entity/create')(CONFIG)
const { randomString, undesiredRes } = require('../../lib/tests_utils')
const { isItemId, isPropertyId, simplify } = require('wikibase-sdk')

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

  it('should create an item', done => {
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
      isItemId(res.entity.id).should.be.true()
      res.entity.labels.en.value.should.equal(label)
      res.entity.descriptions.fr.value.should.equal(description)
      simplify.claim(res.entity.claims.P17[0]).should.equal('Q166376')
      done()
    })
    .catch(done)
  })

  it('should reject a property creation without type', done => {
    createEntity({ datatype: 'string' })
    .then(undesiredRes(done))
    .catch(err => {
      err.message.should.equal("an item can't have a datatype")
      done()
    })
    .catch(done)
  })

  it('should reject a property creation without datatype', done => {
    createEntity({ type: 'property' })
    .then(undesiredRes(done))
    .catch(err => {
      err.message.should.equal('missing property datatype')
      done()
    })
    .catch(done)
  })


  it('should create a property', done => {
    const label = `wikidata-edit entity.create test (${randomString()})`
    const description = randomString()
    createEntity({
      type: 'property',
      datatype: 'string',
      labels: { en: label },
      aliases: { fr: randomString(), en: [ randomString() ] },
      descriptions: { fr: description }
    })
    .then(res => {
      res.success.should.equal(1)
      isPropertyId(res.entity.id).should.be.true()
      res.entity.labels.en.value.should.equal(label)
      res.entity.descriptions.fr.value.should.equal(description)
      done()
    })
    .catch(done)
  })
})

// Not testing more as data validation is done by entity.edit tests
// and checking that everything works would involved creating new entities
// on Wikidata, just for the sake of tests, which is probably not welcome
