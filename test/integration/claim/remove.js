require('module-alias/register')
require('should')
const config = require('config')
const wbEdit = require('root')(config)
const { randomString } = require('test/unit/utils')
const { getSandboxPropertyId } = require('test/integration/utils/sandbox_entities')
const { addClaim } = require('test/integration/utils/sandbox_snaks')

describe('claim create', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('test/integration/utils/wait_for_instance'))

  it('should remove a claim', async () => {
    const { guid } = await addClaim({ datatype: 'string', value: randomString() })
    const res = await wbEdit.claim.remove({ guid })
    res.success.should.equal(1)
    res.claims.should.deepEqual([ guid ])
  })

  it('should remove several claims on a same entity', async () => {
    const propertyId = await getSandboxPropertyId('string')
    const claims = {}
    claims[propertyId] = [ randomString(), randomString() ]
    const res = await createEntity(claims)
    const guids = getGuids(res.entity, propertyId)
    const res2 = await wbEdit.claim.remove({ guid: guids })
    res2.success.should.equal(1)
    res2.claims.should.deepEqual(guids)
  })

  // The documentation explicitly specify that the claims should belong to the same entity
  // https://www.wikidata.org/w/api.php?action=help&modules=wbremoveclaims

  // it('should remove several claims on different entities', async () => {
  //   const propertyId = await getSandboxPropertyId('string')
  //   const claims = {}
  //   claims[propertyId] = randomString()
  //   const [ res1, res2 ] = await Promise.all([
  //     createEntity(claims),
  //     createEntity(claims)
  //   ])
  //   const guid1 = getGuids(res1.entity, propertyId)[0]
  //   const guid2 = getGuids(res2.entity, propertyId)[0]
  //   const res2 = await wbEdit.claim.remove({ guid: [ guid1, guid2 ] })
  //   res2.success.should.equal(1)
  //   res2.claims.should.deepEqual(guids)
  // })
})

const createEntity = claims => {
  return wbEdit.entity.create({
    labels: { en: randomString() },
    claims
  })
}

const getGuids = (entity, propertyId) => entity.claims[propertyId].map(claim => claim.id)
