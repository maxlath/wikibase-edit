import config from 'config'
import should from 'should'
import { getProperty } from '#tests/integration/utils/get_property'
import { createItem, getSomeEntityId, getSomeGuid } from '#tests/integration/utils/sandbox_entities'
import { addClaim } from '#tests/integration/utils/sandbox_snaks'
import { shouldNotBeCalled, getLastEditSummary } from '#tests/integration/utils/utils'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)
const { move: moveClaims } = wbEdit.claim

describe('move claim', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should reject missing guid', async () => {
    try {
      await moveClaims({}).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing claim guid or property claims id')
    }
  })

  it('should reject invalid guid', async () => {
    try {
      await moveClaims({ guid: 123 }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid claim guid')
    }
  })

  it('should reject missing entity id', async () => {
    try {
      const guid = await getSomeGuid()
      await moveClaims({ guid }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing target entity id')
    }
  })

  it('should reject invalid entity id', async () => {
    try {
      const guid = await getSomeGuid()
      await moveClaims({ guid, id: 'foo' }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid target entity id')
    }
  })

  it('should reject missing property', async () => {
    try {
      const guid = await getSomeGuid()
      const id = await getSomeEntityId()
      await moveClaims({ guid, id }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing property id')
    }
  })

  it('should reject invalid property', async () => {
    try {
      const guid = await getSomeGuid()
      const id = await getSomeEntityId()
      await moveClaims({ guid, id, property: '123' }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('invalid property id')
    }
  })

  it('should move a claim from one property to another', async () => {
    const { id } = await createItem()
    const { guid, property: currentProperty } = await addClaim({ id, datatype: 'string', value: randomString() })
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const [ res ] = await moveClaims({ guid, id, property: otherStringPropertyId })
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
    const [ res ] = await moveClaims({ guid, id, property: otherStringPropertyId })
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
    const [ res ] = await moveClaims({ guid, id, property: otherStringPropertyId })
    const summary = await getLastEditSummary(res)
    summary.split('*/')[1].trim()
    .should.equal(`moving a ${currentProperty} claim to ${otherStringPropertyId}`)
  })

  it("should reject if properties datatypes don't match (and don't have a type converter)", async () => {
    const { guid, id, property } = await addClaim({ datatype: 'string', value: randomString() })
    const { id: someUnconvertablePropertyId } = await getProperty({ datatype: 'wikibase-item' })
    try {
      await moveClaims({ guid, id, property: someUnconvertablePropertyId }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.startWith("properties datatype don't match")
      err.context.originPropertyId.should.equal(property)
      err.context.targetPropertyId.should.equal(someUnconvertablePropertyId)
    }
  })

  it('should move a claim from one entity to another', async () => {
    const { guid, id, property } = await addClaim({ datatype: 'string', value: randomString() })
    const { id: otherItemId } = await createItem()
    const res = await moveClaims({ guid, id: otherItemId, property })
    const [ removeClaimRes, addClaimRes ] = res
    removeClaimRes.entity.id.should.equal(id)
    addClaimRes.entity.id.should.equal(otherItemId)
  })

  it('should update the value if a new value is passed', async () => {
    const { id } = await createItem()
    const { guid, property: currentProperty } = await addClaim({ id, datatype: 'string', value: randomString() })
    const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
    const newValue = randomString()
    const [ res ] = await moveClaims({ guid, id, property: otherStringPropertyId, newValue })
    const { entity } = res
    entity.id.should.equal(id)
    should(entity.claims[currentProperty]).not.be.ok()
    const movedClaim = entity.claims[otherStringPropertyId][0]
    movedClaim.id.should.not.equal(guid)
    movedClaim.mainsnak.datavalue.value.should.equal(newValue)
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

      it('should reject to convert a non-number string', async () => {
        await testTypeConversion({
          originalType: 'string',
          originalValue: '123.abc',
          targetType: 'quantity',
        })
        .then(shouldNotBeCalled)
        .catch(err => {
          err.message.should.equal("properties datatype don't match and string->quantity type conversion failed: invalid string number")
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

    describe('monolingualtext->string', () => {
      it('should not convert a string to a monolingualtext', async () => {
        await testTypeConversion({
          originalType: 'string',
          originalValue: randomString(),
          targetType: 'monolingualtext',
        })
        .then(shouldNotBeCalled)
        .catch(err => {
          err.message.should.startWith("properties datatype don't match")
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
  const { id: otherPropertyId } = await getProperty({ datatype: targetType })
  const [ { entity } ] = await moveClaims({ guid, id: itemId, property: otherPropertyId })
  const movedClaim = entity.claims[otherPropertyId].slice(-1)[0]
  movedClaim.mainsnak.datatype.should.equal(targetType)
  movedClaim.mainsnak.datavalue.value.should.deepEqual(targetValue)
}
