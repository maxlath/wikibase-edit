require('module-alias/register')
const should = require('should')
const config = require('config')
const wbEdit = require('root')(config)
const { move: moveQualifier } = wbEdit.qualifier
const { shouldNotBeCalled, getLastEditSummary } = require('test/integration/utils/utils')
const { getSomeGuid } = require('test/integration/utils/sandbox_entities')
const { addClaim, addQualifier } = require('test/integration/utils/sandbox_snaks')
const { randomString } = require('test/unit/utils')
const getProperty = require('test/integration/utils/get_property')

describe('qualifier move', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('test/integration/utils/wait_for_instance'))

  it('should reject missing guid', async () => {
    try {
      await moveQualifier({}).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing claim guid')
    }
  })

  it('should reject missing old property', async () => {
    try {
      const guid = await getSomeGuid()
      await moveQualifier({ guid }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing old property')
    }
  })

  it('should reject missing new property', async () => {
    try {
      const { guid, property: oldProperty } = await addQualifier({ datatype: 'string', value: randomString() })
      await moveQualifier({ guid, oldProperty }).then(shouldNotBeCalled)
    } catch (err) {
      err.message.should.equal('missing new property')
    }
  })

  it('should move property qualifiers', async () => {
    const [ valueA, valueB ] = [ randomString(), randomString() ]
    const { guid } = await addClaim({ datatype: 'string', value: randomString() })
    const { property: oldProperty } = await addQualifier({ guid, datatype: 'string', value: valueA })
    await addQualifier({ guid, property: oldProperty, value: valueB })
    const { id: newProperty } = await getProperty({ datatype: 'string', reserved: true })
    const { claim } = await moveQualifier({ guid, oldProperty, newProperty })
    should(claim.qualifiers[oldProperty]).not.be.ok()
    claim.qualifiers[newProperty][0].datavalue.value.should.equal(valueA)
    claim.qualifiers[newProperty][1].datavalue.value.should.equal(valueB)
  })

  it('should move a unique qualifier', async () => {
    const [ valueA, valueB ] = [ randomString(), randomString() ]
    const { id: oldProperty } = await getProperty({ datatype: 'string', reserved: true })
    const { guid, hash } = await addQualifier({ property: oldProperty, value: valueA })
    await addQualifier({ guid, property: oldProperty, value: valueB })
    const { id: newProperty } = await getProperty({ datatype: 'string', reserved: true })
    const { claim } = await moveQualifier({ guid, hash, oldProperty, newProperty })
    claim.qualifiers[oldProperty][0].datavalue.value.should.equal(valueB)
    claim.qualifiers[newProperty][0].datavalue.value.should.equal(valueA)
  })

  it('should generate a custom summary', async () => {
    const [ valueA, valueB ] = [ randomString(), randomString() ]
    const { id, guid } = await addClaim({ datatype: 'string', value: randomString() })
    const { property: oldProperty } = await addQualifier({ guid, datatype: 'string', value: valueA })
    await addQualifier({ guid, property: oldProperty, value: valueB })
    const { id: newProperty } = await getProperty({ datatype: 'string', reserved: true })
    await moveQualifier({ guid, oldProperty, newProperty })
    const summary = await getLastEditSummary(id)
    summary.split('*/')[1].trim()
    .should.equal(`moving ${guid} ${oldProperty} qualifiers to ${newProperty}`)
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
          targetType: 'quantity'
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
          targetType: 'monolingualtext'
        })
        .then(shouldNotBeCalled)
        .catch(err => {
          err.message.should.startWith("properties datatype don't match")
        })
      })
    })
  })
})

const testTypeConversion = async ({ originalType, originalValue, targetType, targetValue }) => {
  const { id: oldProperty } = await getProperty({ datatype: originalType })
  const { id: newProperty } = await getProperty({ datatype: targetType })
  const { guid, hash } = await addQualifier({ property: oldProperty, value: originalValue })
  const { claim } = await moveQualifier({ guid, hash, oldProperty, newProperty })
  const movedQualifier = claim.qualifiers[newProperty].slice(-1)[0]
  movedQualifier.datavalue.value.should.deepEqual(targetValue)
}
