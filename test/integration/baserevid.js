require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = require('../unit/utils')
const { shouldNotBeCalled } = require('./utils/utils')
const { getSandboxItem, getRefreshedEntity, getSandboxItemId, getSandboxPropertyId } = require('./utils/sandbox_entities')
const { addClaim, addQualifier } = require('./utils/sandbox_snaks')
const getProperty = require('./utils/get_property')

describe('baserevid', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should accept a valid baserevid', async () => {
    const { id } = await getSandboxItem()
    const { lastrevid } = await getRefreshedEntity(id)
    const res = await wbEdit.label.set({
      id,
      language: 'fr',
      value: randomString(),
    }, {
      baserevid: lastrevid
    })
    res.success.should.equal(1)
    res.entity.lastrevid.should.equal(lastrevid + 1)
  })

  it('should pass baserevid from request config', async () => {
    const { id } = await getSandboxItem()
    await wbEdit.label.set({
      id,
      language: 'fr',
      value: randomString(),
    }, {
      baserevid: 1
    })
    .then(shouldNotBeCalled)
    .catch(err => {
      err.body.error.code.should.equal('cant-load-entity-content')
    })
  })

  it('should pass baserevid from edit object', async () => {
    const { id } = await getSandboxItem()
    await wbEdit.entity.edit({
      id,
      labels: { la: randomString() },
      baserevid: 1
    })
    .then(shouldNotBeCalled)
    .catch(err => {
      err.body.error.code.should.equal('cant-load-entity-content')
    })
  })

  describe('request wrapper commands', () => {
    it('should pass baserevid from commands object', async () => {
      const { id } = await getSandboxItem()
      await wbEdit.label.set({
        id,
        language: 'fr',
        value: randomString(),
        baserevid: 1,
      })
      .then(shouldNotBeCalled)
      .catch(err => {
        err.body.error.code.should.equal('cant-load-entity-content')
      })
    })
  })

  describe('bundle wrapper commands', () => {
    it('should pass a baserevid in claim.create', async () => {
      const [ id, property ] = await Promise.all([
        getSandboxItemId(),
        getSandboxPropertyId('string')
      ])
      const value = randomString()
      await wbEdit.claim.create({ id, property, value, baserevid: 1 })
      .then(shouldNotBeCalled)
      .catch(err => {
        err.body.error.code.should.equal('cant-load-entity-content')
      })
    })

    it('should pass a baserevid in claim.move when targeting a single entity', async () => {
      const { id, guid } = await addClaim({ datatype: 'quantity', value: 123 })
      const stringProperty = await getSandboxPropertyId('string')
      await wbEdit.claim.move({
        guid,
        id,
        property: stringProperty,
        baserevid: 1
      })
      .then(shouldNotBeCalled)
      .catch(err => {
        err.body.error.code.should.equal('cant-load-entity-content')
      })
    })

    it('should not allow to pass a baserevid in claim.move when edit targeting multiple entities', async () => {
      const { property, guid } = await addClaim()
      await wbEdit.claim.move({
        guid,
        id: 'Q1',
        property,
        baserevid: 1
      })
      .then(shouldNotBeCalled)
      .catch(err => {
        err.message.should.equal('commands editing multiple entities can not have a baserevid')
      })
    })

    it('should pass a baserevid in claim.update', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { guid } = await addClaim({ datatype: 'string', value: oldValue })
      await wbEdit.claim.update({ guid, newValue, baserevid: 1 })
      .then(shouldNotBeCalled)
      .catch(err => {
        err.body.error.code.should.equal('cant-load-entity-content')
      })
    })

    it('should pass a baserevid in qualifier.move', async () => {
      const [ valueA, valueB ] = [ randomString(), randomString() ]
      const { id: oldProperty } = await getProperty({ datatype: 'string', reserved: true })
      const { guid, hash } = await addQualifier({ property: oldProperty, value: valueA })
      await addQualifier({ guid, property: oldProperty, value: valueB })
      const { id: newProperty } = await getProperty({ datatype: 'string', reserved: true })
      await wbEdit.qualifier.move({ guid, hash, oldProperty, newProperty, baserevid: 1 })
      .then(shouldNotBeCalled)
      .catch(err => {
        err.body.error.code.should.equal('cant-load-entity-content')
      })
    })

    it('should pass a baserevid in qualifier.update', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { guid, property } = await addQualifier({ datatype: 'string', value: oldValue })
      await wbEdit.qualifier.update({ guid, property, oldValue, newValue, baserevid: 1 })
      .then(shouldNotBeCalled)
      .catch(err => {
        err.body.error.code.should.equal('cant-load-entity-content')
      })
    })
  })
})
