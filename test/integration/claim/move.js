const should = require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { move: moveClaim } = wbEdit.claim
const { shouldNotGetHere } = __.require('test/integration/utils/utils')
const { getSandboxItemId } = __.require('test/integration/utils/sandbox_entities')
const { addClaim } = __.require('test/integration/utils/sandbox_snaks')
const { randomString } = __.require('test/unit/utils')
const getProperty = __.require('test/integration/utils/get_property')

let someGuid
const getSomeGuid = async () => {
  if (someGuid) return someGuid
  const { guid } = await addClaim('string', randomString())
  someGuid = guid
  return guid
}

let someEntityId
const getSomeEntityId = async () => {
  someEntityId = someEntityId || await getSandboxItemId()
  return someEntityId
}

describe('claim move', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should reject missing guid', async () => {
    try {
      const res = await moveClaim({})
      shouldNotGetHere(res)
    } catch (err) {
      err.message.should.equal('missing claim guid')
    }
  })

  it('should reject invalid guid', async () => {
    try {
      const res = await moveClaim({ guid: 123 })
      shouldNotGetHere(res)
    } catch (err) {
      err.message.should.equal('invalid claim guid')
    }
  })

  it('should reject missing entity id', async () => {
    try {
      const guid = await getSomeGuid()
      const res = await moveClaim({ guid })
      shouldNotGetHere(res)
    } catch (err) {
      err.message.should.equal('missing target entity id')
    }
  })

  it('should reject invalid entity id', async () => {
    try {
      const guid = await getSomeGuid()
      const res = await moveClaim({ guid, id: 'foo' })
      shouldNotGetHere(res)
    } catch (err) {
      err.message.should.equal('invalid target entity id')
    }
  })

  it('should reject missing property', async () => {
    try {
      const guid = await getSomeGuid()
      const id = await getSomeEntityId()
      console.log('id', id)
      const res = await moveClaim({ guid, id })
      shouldNotGetHere(res)
    } catch (err) {
      err.message.should.equal('missing property id')
    }
  })

  it('should reject invalid property', async () => {
    try {
      const guid = await getSomeGuid()
      const id = await getSomeEntityId()
      const res = await moveClaim({ guid, id, property: '123' })
      shouldNotGetHere(res)
    } catch (err) {
      err.message.should.equal('invalid property id')
    }
  })

  it('should move a claim from one property to another', async () => {
    const { guid, id, property } = await addClaim('string', randomString())
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const [ res ] = await moveClaim({ guid, id, property: otherStringPropertyId })
    const { entity } = res
    entity.id.should.equal(id)
    should(entity.claims[property]).not.be.ok()
    const movedClaim = entity.claims[otherStringPropertyId][0]
    movedClaim.id.should.equal(guid)
  })

  it("should reject if properties datatypes don't match", async () => {
    const { guid, id, property } = await addClaim('string', randomString())
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'quantity' })
    try {
      const res = await moveClaim({ guid, id, property: otherStringPropertyId })
      shouldNotGetHere(res)
    } catch (err) {
      err.message.should.equal("properties datatype don't match")
      err.context.property.should.equal(otherStringPropertyId)
      err.context.propertyDatatype.should.equal('quantity')
      err.context.currentProperty.should.equal(property)
      err.context.currentPropertyDatatype.should.equal('string')
    }
  })
})
