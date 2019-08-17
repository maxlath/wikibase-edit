require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const { getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')
const { addClaim } = __.require('test/integration/utils/sandbox_snaks')

describe('claim create', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should remove a claim', done => {
    addClaim('string', randomString())
    .then(({ guid }) => {
      return wbEdit.claim.remove({ guid })
      .then(res => {
        res.success.should.equal(1)
        res.claims.should.deepEqual([ guid ])
        done()
      })
    })
    .catch(done)
  })

  it('should remove several claims on a same entity', done => {
    getSandboxPropertyId('string')
    .then(propertyId => {
      const claims = {}
      claims[propertyId] = [ randomString(), randomString() ]
      return createEntity(claims)
      .then(res => {
        const guids = getGuids(res.entity, propertyId)
        return wbEdit.claim.remove({ guid: guids })
        .then(res2 => {
          res2.success.should.equal(1)
          res2.claims.should.deepEqual(guids)
          done()
        })
      })
    })
    .catch(done)
  })

  // The documentation explicitly specify that the claims should belong to the same entity
  // https://www.wikidata.org/w/api.php?action=help&modules=wbremoveclaims

  // it('should remove several claims on different entities', done => {
  //   getSandboxPropertyId('string')
  //   .then(propertyId => {
  //     const claims = {}
  //     claims[propertyId] = randomString()
  //     return Promise.all([
  //       createEntity(claims),
  //       createEntity(claims)
  //     ])
  //     .then(([ res1, res2 ]) => {
  //       const guid1 = getGuids(res1.entity, propertyId)[0]
  //       const guid2 = getGuids(res2.entity, propertyId)[0]
  //       return wbEdit.claim.remove({ guid: [ guid1, guid2 ] })
  //       .then(res2 => {
  //         res2.success.should.equal(1)
  //         res2.claims.should.deepEqual(guids)
  //         done()
  //       })
  //     })
  //   })
  //   .catch(done)
  // })
})

const createEntity = claims => {
  return wbEdit.entity.create({
    labels: { en: randomString() },
    claims
  })
}

const getGuids = (entity, propertyId) => entity.claims[propertyId].map(claim => claim.id)
