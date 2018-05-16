require('should')
const CONFIG = require('config')
const editEntity = require('../../lib/entity/edit')(CONFIG)
const { randomString, sandboxEntity, sandboxDescriptionFr } = require('../../lib/tests_utils')
const wdk = require('wikidata-sdk')

describe('entity edit', function () {
  this.timeout(20 * 1000)

  it('should be a function', done => {
    editEntity.should.be.a.Function()
    done()
  })

  it('should reject a missing id', done => {
    editEntity.should.be.a.Function()
    editEntity({ claims: { P31: 'bla' } })
    .catch(err => {
      err.message.should.equal('invalid entity id')
      done()
    })
    .catch(done)
  })

  it('should reject an edit without data', done => {
    editEntity.should.be.a.Function()
    editEntity({ id: sandboxEntity })
    .catch(err => {
      err.message.should.equal('no data was passed')
      done()
    })
    .catch(done)
  })

  it('should reject invalid claims', done => {
    editEntity.should.be.a.Function()
    editEntity({ id: sandboxEntity, claims: { P31: 'bla' } })
    .catch(err => {
      err.message.should.equal('invalid entity value')
      done()
    })
    .catch(done)
  })

  it('should reject invalid labels', done => {
    editEntity.should.be.a.Function()
    editEntity({ id: sandboxEntity, labels: { fr: '' } })
    .catch(err => {
      err.message.should.equal('invalid label')
      done()
    })
    .catch(done)
  })

  it('should reject invalid descriptions', done => {
    editEntity.should.be.a.Function()
    editEntity({ id: sandboxEntity, descriptions: { fr: '' } })
    .catch(err => {
      err.message.should.equal('invalid description')
      done()
    })
    .catch(done)
  })

  it('should edit an entity', done => {
    const label = `Bac à Sable (${randomString()})`
    const description = `${sandboxDescriptionFr} (${randomString()})`
    editEntity({
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
    .catch(done)
  })

  it('should edit an entity with qualifiers', done => {
    editEntity({
      id: sandboxEntity,
      claims: {
        P369: [
          { value: 'Q5111731', qualifiers: { P1545: '17', P1416: [ 'Q13406268' ] } },
          {
            value: 'Q2622002',
            qualifiers: {
              P580: '1789-08-04',
              P1106: { amount: 9001, unit: 'Q7727' },
              P1476: { text: 'bulgroz', language: 'fr' }
            }
          }
        ]
      }
    })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should edit an entity with a reference', done => {
    editEntity({
      id: sandboxEntity,
      claims: {
        P369: { value: 'Q2622002', references: { P855: 'https://example.org', P143: 'Q8447' } }
      }
    })
    .then(res => {
      res.success.should.equal(1)
      const lastClaim = res.entity.claims.P369.slice(-1)[0]
      const urlRef = lastClaim.references[0].snaks.P855[0]
      urlRef.datavalue.value.should.equal('https://example.org')
      done()
    })
    .catch(done)
  })

  it('should edit an entity with multiple references', done => {
    editEntity({
      id: sandboxEntity,
      claims: {
        P369: [
          {
            value: 'Q2622002',
            references: [
              { P855: 'https://example.org', P143: 'Q8447' },
              { P855: 'https://example2.org', P143: 'Q8447' }
            ]
          }
        ]
      }
    })
    .then(res => {
      res.success.should.equal(1)
      const lastClaim = res.entity.claims.P369.slice(-1)[0]
      const urlRef = lastClaim.references[0].snaks.P855[0]
      urlRef.datavalue.value.should.equal('https://example.org')
      done()
    })
    .catch(done)
  })

  it('should edit an entity with a monolingual text claim', done => {
    editEntity({
      id: sandboxEntity,
      claims: { P1705: { text: 'Lundeborg', 'language': 'mul' } }
    })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should edit an entity with a quantity claim', done => {
    editEntity({
      id: sandboxEntity,
      claims: { P1106: { amount: 9001, unit: 'Q7727' } }
    })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should edit an entity with a rich value and qualifiers', done => {
    editEntity({
      id: sandboxEntity,
      claims: {
        P1106: {
          value: { amount: 9002, unit: 'Q7727' },
          qualifiers: { P580: '1789-08-04' }
        }
      }
    })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should edit an entity with a globe coordinate claim', done => {
    editEntity({
      id: sandboxEntity,
      claims: { P626: { latitude: 45.758, longitude: 4.84138, precision: 1 / 360 } }
    })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

})
