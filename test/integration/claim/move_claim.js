const should = require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { move: moveClaim } = wbEdit.claim
const { shouldNotBeCalled } = __.require('test/integration/utils/utils')
const { createItem, getSomeEntityId, getSomeGuid } = __.require('test/integration/utils/sandbox_entities')
const { addClaim } = __.require('test/integration/utils/sandbox_snaks')
const { randomString } = __.require('test/unit/utils')
const getProperty = __.require('test/integration/utils/get_property')

describe('move claim', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should reject missing guid', async () => {
    try {
      await moveClaim({}).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing claim guid or property claims id')
    }
  })

  it('should reject invalid guid', async () => {
    try {
      await moveClaim({ guid: 123 }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid claim guid')
    }
  })

  it('should reject missing entity id', async () => {
    try {
      const guid = await getSomeGuid()
      await moveClaim({ guid }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing target entity id')
    }
  })

  it('should reject invalid entity id', async () => {
    try {
      const guid = await getSomeGuid()
      await moveClaim({ guid, id: 'foo' }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid target entity id')
    }
  })

  it('should reject missing property', async () => {
    try {
      const guid = await getSomeGuid()
      const id = await getSomeEntityId()
      await moveClaim({ guid, id }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing property id')
    }
  })

  it('should reject invalid property', async () => {
    try {
      const guid = await getSomeGuid()
      const id = await getSomeEntityId()
      await moveClaim({ guid, id, property: '123' }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid property id')
    }
  })

  it('should move a claim from one property to another', async () => {
    const { id } = await createItem()
    const { guid, property: currentProperty } = await addClaim({ id, datatype: 'string', value: randomString() })
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const [ res ] = await moveClaim({ guid, id, property: otherStringPropertyId })
    const { entity } = res
    entity.id.should.equal(id)
    should(entity.claims[currentProperty]).not.be.ok()
    const movedClaim = entity.claims[otherStringPropertyId][0]
    movedClaim.id.should.not.equal(guid)
  })

  it("should reject if properties datatypes don't match", async () => {
    const { guid, id, property } = await addClaim({ datatype: 'string', value: randomString() })
    const { id: someQuantityProperty } = await getProperty({ datatype: 'quantity' })
    try {
      await moveClaim({ guid, id, property: someQuantityProperty }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal("properties datatype don't match")
      err.context.property.should.equal(someQuantityProperty)
      err.context.propertyDatatype.should.equal('quantity')
      err.context.currentProperty.should.equal(property)
      err.context.currentPropertyDatatype.should.equal('string')
    }
  })

  it('should move a claim from one entity to another', async () => {
    const { guid, id, property } = await addClaim({ datatype: 'string', value: randomString() })
    const { id: otherItemId } = await createItem()
    const res = await moveClaim({ guid, id: otherItemId, property })
    const [ removeClaimRes, addClaimRes ] = res
    removeClaimRes.entity.id.should.equal(id)
    addClaimRes.entity.id.should.equal(otherItemId)
  })
})
