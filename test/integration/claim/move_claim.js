const should = require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { move: moveClaim } = wbEdit.claim
const { shouldNotBeCalled, getLastEditSummary } = __.require('test/integration/utils/utils')
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

  it('should move only the claim identified with a guid', async () => {
    const { id } = await createItem()
    const { guid, property: currentProperty } = await addClaim({ id, datatype: 'string', value: randomString() })
    const { guid: otherClaimGuid } = await addClaim({ id, property: currentProperty, value: randomString() })
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const [ res ] = await moveClaim({ guid, id, property: otherStringPropertyId })
    const { entity } = res
    entity.id.should.equal(id)
    entity.claims[currentProperty][0].id.should.equal(otherClaimGuid)
    const movedClaim = entity.claims[otherStringPropertyId][0]
    movedClaim.id.should.not.equal(guid)
  })

  it('should generate a custom summary', async () => {
    const { id } = await createItem()
    const { guid, property: currentProperty } = await addClaim({ id, datatype: 'string', value: randomString() })
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const [ res ] = await moveClaim({ guid, id, property: otherStringPropertyId })
    const summary = await getLastEditSummary(res)
    summary.split('*/')[1].trim()
    .should.equal(`moving a ${currentProperty} claim to ${otherStringPropertyId}`)
  })

  it("should reject if properties datatypes don't match (and don't have a type converter)", async () => {
    const { guid, id, property } = await addClaim({ datatype: 'string', value: randomString() })
    const { id: someQuantityProperty } = await getProperty({ datatype: 'wikibase-item' })
    try {
      await moveClaim({ guid, id, property: someQuantityProperty }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal("properties datatype don't match")
      err.context.property.should.equal(someQuantityProperty)
      err.context.propertyDatatype.should.equal('wikibase-item')
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

  describe('type conversions', () => {
    describe('string->quantity', () => {
      it('should convert a positive string number value to quantity', async () => {
        await testTypeConversion({
          originalType: 'string',
          originalValue: '765.521521',
          targetType: 'quantity',
          targetValue: { amount: '+765.521521', unit: '1' },
        })
      })

      it('should convert a signed positive string number value to quantity', async () => {
        await testTypeConversion({
          originalType: 'string',
          originalValue: '+123.52',
          targetType: 'quantity',
          targetValue: { amount: '+123.52', unit: '1' },
        })
      })

      it('should convert a negative string number value to quantity', async () => {
        await testTypeConversion({
          originalType: 'string',
          originalValue: '-5519.521521',
          targetType: 'quantity',
          targetValue: { amount: '-5519.521521', unit: '1' },
        })
      })
    })

    describe('quantity->string', () => {
      it('should convert a positive integer to a string', async () => {
        await testTypeConversion({
          originalType: 'quantity',
          originalValue: 96,
          targetType: 'string',
          targetValue: '96',
        })
      })

      it('should convert a positive float to a string', async () => {
        await testTypeConversion({
          originalType: 'quantity',
          originalValue: 987.456,
          targetType: 'string',
          targetValue: '987.456',
        })
      })

      it('should convert a negative integer to a string', async () => {
        await testTypeConversion({
          originalType: 'quantity',
          originalValue: -654,
          targetType: 'string',
          targetValue: '-654',
        })
      })

      it('should convert a negative float to a string', async () => {
        await testTypeConversion({
          originalType: 'quantity',
          originalValue: -12.56,
          targetType: 'string',
          targetValue: '-12.56',
        })
      })
    })

    describe('external-id->string', () => {
      it('should convert an external-id to a string', async () => {
        const value = randomString()
        await testTypeConversion({
          originalType: 'external-id',
          originalValue: value,
          targetType: 'string',
          targetValue: value,
        })
      })
    })
    describe('string->external-id', () => {
      it('should convert a string to an external-id', async () => {
        const value = randomString()
        await testTypeConversion({
          originalType: 'string',
          originalValue: value,
          targetType: 'external-id',
          targetValue: value,
        })
      })
    })
    describe('monolingualtext->string', () => {
      it('should convert a monolingualtext to a string', async () => {
        const value = randomString()
        await testTypeConversion({
          originalType: 'monolingualtext',
          originalValue: { text: value, language: 'en' },
          targetType: 'string',
          targetValue: value,
        })
      })
    })
  })
})

let itemId
const testTypeConversion = async ({ originalType, originalValue, targetType, targetValue }) => {
  // It's safe to reuse the same item as we are using claim guids
  itemId = itemId || (await createItem()).id
  const { guid } = await addClaim({ id: itemId, datatype: originalType, value: originalValue })
  const { id: otherStringPropertyId } = await getProperty({ datatype: targetType })
  const [ { entity } ] = await moveClaim({ guid, id: itemId, property: otherStringPropertyId })
  const movedClaim = entity.claims[otherStringPropertyId].slice(-1)[0]
  movedClaim.mainsnak.datatype.should.equal(targetType)
  movedClaim.mainsnak.datavalue.value.should.deepEqual(targetValue)
}
