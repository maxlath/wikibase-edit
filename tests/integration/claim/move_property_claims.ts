import config from 'config'
import should from 'should'
import getProperty from '#tests/integration/utils/get_property'
import { createItem, getSomeEntityId } from '#tests/integration/utils/sandbox_entities'
import { addClaim } from '#tests/integration/utils/sandbox_snaks'
import { shouldNotBeCalled, getLastEditSummary } from '#tests/integration/utils/utils'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)
const { move: movePropertyClaims } = wbEdit.claim
let somePropertyClaimsId

describe('move property claims', async () => {
  before(async () => {
    const { id: propertyId } = await getProperty({ datatype: 'string' })
    somePropertyClaimsId = `Q1#${propertyId}`
    console.log('somePropertyClaimsId', somePropertyClaimsId)
  })

  it('should reject invalid property claims id', async () => {
    try {
      await movePropertyClaims({ propertyClaimsId: 'Q1~P31' }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid property id')
    }
  })

  it('should reject missing entity id', async () => {
    try {
      await movePropertyClaims({ propertyClaimsId: somePropertyClaimsId }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing target entity id')
    }
  })

  it('should reject invalid entity id', async () => {
    try {
      await movePropertyClaims({ propertyClaimsId: somePropertyClaimsId, id: 'foo' }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid target entity id')
    }
  })

  it('should reject missing property', async () => {
    try {
      const id = await getSomeEntityId()
      await movePropertyClaims({ propertyClaimsId: somePropertyClaimsId, id }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing property id')
    }
  })

  it('should reject invalid property', async () => {
    try {
      const id = await getSomeEntityId()
      await movePropertyClaims({ propertyClaimsId: somePropertyClaimsId, id, property: '123' }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid property id')
    }
  })

  it('should reject move operation with no entity or property change', async () => {
    const { id, property } = await addClaim({ datatype: 'string', value: randomString() })
    const propertyClaimsId = `${id}#${property}`
    try {
      await movePropertyClaims({ propertyClaimsId, id, property }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal("move operation wouldn't have any effect: same entity, same property")
    }
  })

  it("should reject if properties datatypes don't match (and can't be converted)", async () => {
    const { id, property } = await addClaim({ datatype: 'string', value: randomString() })
    const propertyClaimsId = `${id}#${property}`
    const { id: someQuantityProperty } = await getProperty({ datatype: 'quantity' })
    try {
      await movePropertyClaims({ propertyClaimsId, id, property: someQuantityProperty }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.startWith("properties datatype don't match")
      err.context.targetPropertyId.should.equal(someQuantityProperty)
      err.context.targetDatatype.should.equal('quantity')
      err.context.originPropertyId.should.equal(property)
      err.context.originDatatype.should.equal('string')
    }
  })

  it('should reject moves with no claims to move', async () => {
    const { id } = await createItem()
    const { id: someStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const propertyClaimsId = `${id}#${someStringPropertyId}`
    try {
      await movePropertyClaims({ propertyClaimsId, id, property: otherStringPropertyId }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('no property claims found')
    }
  })

  it('should move property claims from one property to another', async () => {
    const { id } = await createItem()
    const { guid, property: currentPropertyId } = await addClaim({ id, datatype: 'string', value: randomString() })
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const propertyClaimsId = `${id}#${currentPropertyId}`
    const res = await movePropertyClaims({ propertyClaimsId, id, property: otherStringPropertyId })
    const { entity } = res[0]
    entity.id.should.equal(id)
    should(entity.claims[currentPropertyId]).not.be.ok()
    const movedClaim = entity.claims[otherStringPropertyId][0]
    movedClaim.id.should.not.equal(guid)
  })

  it('should generate a custom summary', async () => {
    const { id } = await createItem()
    const { property: currentPropertyId } = await addClaim({ id, datatype: 'string', value: randomString() })
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const propertyClaimsId = `${id}#${currentPropertyId}`
    const res = await movePropertyClaims({ propertyClaimsId, id, property: otherStringPropertyId })
    const summary = await getLastEditSummary(res[0])
    summary.split('*/')[1].trim().should.equal(`moving ${currentPropertyId} claims to ${otherStringPropertyId}`)
  })

  it('should move a claim from one entity to another', async () => {
    const value = Math.trunc(Math.random() * 1000)
    const { id: currentPropertyId } = await getProperty({ datatype: 'quantity', reserved: true })
    const { guid, id } = await addClaim({ property: currentPropertyId, value })
    const propertyClaimsId = `${id}#${currentPropertyId}`
    const { id: otherItemId } = await createItem()
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'quantity', reserved: true })
    const res = await movePropertyClaims({ propertyClaimsId, id: otherItemId, property: otherStringPropertyId })
    const [ removeClaimsRes, addClaimsRes ] = res
    const { entity: previousEntity } = removeClaimsRes
    const { entity: newEntity } = addClaimsRes
    previousEntity.id.should.equal(id)
    newEntity.id.should.equal(otherItemId)
    should(previousEntity.claims[currentPropertyId]).not.be.ok()
    should(previousEntity.claims[otherStringPropertyId]).not.be.ok()
    should(newEntity.claims[currentPropertyId]).not.be.ok()
    newEntity.claims[otherStringPropertyId][0].mainsnak.datavalue.value.amount.should.equal(`+${value}`)
    newEntity.claims[otherStringPropertyId][0].id.should.not.equal(guid)
  })

  it('should convert types', async () => {
    const { id } = await createItem()
    const { property: currentPropertyId } = await addClaim({ id, datatype: 'string', value: '123' })
    await addClaim({ id, property: currentPropertyId, value: '456' })
    const { id: otherPropertyId } = await getProperty({ datatype: 'quantity' })
    const propertyClaimsId = `${id}#${currentPropertyId}`
    const [ { entity } ] = await movePropertyClaims({ propertyClaimsId, id, property: otherPropertyId })
    const movedClaims = entity.claims[otherPropertyId]
    movedClaims[0].mainsnak.datatype.should.equal('quantity')
    movedClaims[0].mainsnak.datavalue.value.should.deepEqual({ amount: '+123', unit: '1' })
    movedClaims[1].mainsnak.datatype.should.equal('quantity')
    movedClaims[1].mainsnak.datavalue.value.should.deepEqual({ amount: '+456', unit: '1' })
  })
})
