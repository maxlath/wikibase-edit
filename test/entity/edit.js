require('should')
const CONFIG = require('config')
const editEntity = require('../../lib/entity/edit')
const { randomString, sandboxEntity, sandboxDescriptionFr } = require('../../lib/tests_utils')
const wdk = require('wikidata-sdk')

describe('entity edit', () => {
  it('should be a function', done => {
    editEntity.should.be.a.Function()
    editEntity(CONFIG).should.be.a.Function()
    done()
  })

  it('should reject a missing id', done => {
    editEntity.should.be.a.Function()
    editEntity(CONFIG)({ claims: { P31: 'bla' } })
    .catch(err => {
      err.message.should.equal('invalid entity id')
      done()
    })
  })

  it('should reject an edit without data', done => {
    editEntity.should.be.a.Function()
    editEntity(CONFIG)({ id: sandboxEntity })
    .catch(err => {
      err.message.should.equal('no data was passed')
      done()
    })
  })

  it('should reject invalid claims', done => {
    editEntity.should.be.a.Function()
    editEntity(CONFIG)({ id: sandboxEntity, claims: { P31: 'bla' } })
    .catch(err => {
      err.message.should.equal('invalid claim value')
      done()
    })
  })

  it('should reject invalid labels', done => {
    editEntity.should.be.a.Function()
    editEntity(CONFIG)({ id: sandboxEntity, labels: { fr: '' } })
    .catch(err => {
      err.message.should.equal('invalid label')
      done()
    })
  })

  it('should reject invalid descriptions', done => {
    editEntity.should.be.a.Function()
    editEntity(CONFIG)({ id: sandboxEntity, descriptions: { fr: '' } })
    .catch(err => {
      err.message.should.equal('invalid description')
      done()
    })
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should edit an entity', function (done) {
    this.timeout(5000)
    const label = `Bac à Sable (${randomString()})`
    const description = `${sandboxDescriptionFr} (${randomString()})`
    editEntity(CONFIG)({
      id: sandboxEntity,
      labels: { fr: label },
      descriptions: { fr: description },
      claims: { P1775: 'Q3576110' }
    })
    .then(res => {
      res.success.should.equal(1)
      res.entity.labels.fr.value.should.equal(label)
      res.entity.descriptions.fr.value.should.equal(description)
      const P1775Claims = wdk.simplifyPropertyClaims(res.entity.claims.P1775)
      P1775Claims.includes('Q3576110').should.be.true()
      done()
    })
  })
})
