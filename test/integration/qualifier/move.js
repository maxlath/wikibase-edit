const should = require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { move: moveQualifier } = wbEdit.qualifier
const { shouldNotBeCalled } = __.require('test/integration/utils/utils')
const { getSomeGuid } = __.require('test/integration/utils/sandbox_entities')
const { addClaim, addQualifier } = __.require('test/integration/utils/sandbox_snaks')
const { randomString } = __.require('test/unit/utils')
const getProperty = __.require('test/integration/utils/get_property')

describe('qualifier move', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

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
})
