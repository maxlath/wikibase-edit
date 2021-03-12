require('should')
const config = require('config')
const { instance, credentials } = config
const WBEdit = require('root')
const { randomString } = require('../unit/utils')
const { getLastEditSummary } = require('./utils/utils')
const { getSandboxItemId, getSandboxPropertyId, createItem } = require('./utils/sandbox_entities')
const { addClaim, addQualifier } = require('./utils/sandbox_snaks')
const getProperty = require('./utils/get_property')
const params = summary => ({ summary, labels: { en: randomString() } })

describe('summary', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('tests/integration/utils/wait_for_instance'))

  it('should not add a default summary', async () => {
    const wbEdit = WBEdit({ instance, credentials })
    const editSummary = await postAndGetEditSummary(wbEdit)
    editSummary.should.endWith(' */')
  })

  it('should accept a custom summary in config', async () => {
    const summary = 'some custom summary'
    const customConfig = Object.assign({ instance, credentials, summary })
    const wbEdit = WBEdit(customConfig)
    const editSummary = await postAndGetEditSummary(wbEdit)
    editSummary.should.endWith(` */ ${summary}`)
  })

  it('should accept a custom summary in the request config', async () => {
    const summary = 'another custom summary'
    const wbEdit = WBEdit({ instance, credentials, summary: 'global summary' })
    const editSummary = await postAndGetEditSummary(wbEdit, { summary })
    editSummary.should.endWith(` */ ${summary}`)
  })

  it('should not re-use the previous summary', async () => {
    const summary = 'another custom summary'
    const wbEdit = WBEdit({ instance, credentials })
    const editSummary = await postAndGetEditSummary(wbEdit, { summary })
    editSummary.should.endWith(` */ ${summary}`)
    const editSummary2 = await postAndGetEditSummary(wbEdit)
    editSummary2.should.endWith(' */')
  })

  it('should accept a custom summary in the edit object', async () => {
    const summary = 'and yet another one'
    const wbEdit = WBEdit({ instance, credentials, summary: 'global summary' })
    const editSummary = await postAndGetEditSummary(wbEdit, {}, summary)
    editSummary.should.endWith(` */ ${summary}`)
  })

  describe('request wrapper commands', () => {
    it('should accept a custom summary in commands object', async () => {
      const id = await getSandboxItemId()
      const value = `Bac à Sable (${randomString()})`
      const summary = randomString()
      const wbEdit = WBEdit({ instance, credentials, summary: 'global summary' })
      await wbEdit.label.set({ id, language: 'la', value, summary })
      const comment = await getLastEditSummary(id)
      comment.should.endWith(summary)
    })
  })

  describe('bundle wrapper commands', () => {
    const wbEdit = WBEdit({ instance, credentials, summary: 'global summary' })

    it('should pass a summary in claim.create', async () => {
      const [ id, property ] = await Promise.all([
        getSandboxItemId(),
        getSandboxPropertyId('string')
      ])
      const value = randomString()
      const summary = randomString()
      await wbEdit.claim.create({ id, property, value, summary })
      const comment = await getLastEditSummary(id)
      comment.should.endWith(summary)
    })

    it('should pass a summary in claim.update', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const summary = randomString()
      const { id, property } = await addClaim({ datatype: 'string', value: oldValue })
      await wbEdit.claim.update({ id, property, oldValue, newValue, summary })
      const comment = await getLastEditSummary(id)
      comment.should.endWith(summary)
    })

    it('should pass a summary in claim.move targeting a single entity', async () => {
      const { id } = await createItem()
      const { guid } = await addClaim({ id, datatype: 'string', value: randomString() })
      const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
      const summary = randomString()
      await wbEdit.claim.move({ guid, id, property: otherStringPropertyId, summary })
      const comment = await getLastEditSummary(id)
      comment.should.endWith(summary)
    })

    it('should pass a summary in claim.move targeting a multiple entities', async () => {
      const [ { id: idA }, { id: idB } ] = await Promise.all([ createItem(), createItem() ])
      const { property, guid } = await addClaim({ id: idA, datatype: 'string', value: randomString() })
      const summary = randomString()
      await wbEdit.claim.move({ guid, id: idB, property, summary })
      const commentA = await getLastEditSummary(idA)
      commentA.should.endWith(summary)
      const commentB = await getLastEditSummary(idA)
      commentB.should.endWith(summary)
    })

    it('should pass a summary in qualifier.update', async () => {
      const oldValue = randomString()
      const newValue = randomString()
      const { guid, property } = await addQualifier({ datatype: 'string', value: oldValue })
      const summary = randomString()
      await wbEdit.qualifier.update({ guid, property, oldValue, newValue, summary })
      const comment = await getLastEditSummary(guid.split('$')[0])
      comment.should.endWith(summary)
    })

    it('should pass a summary in qualifier.move', async () => {
      const [ valueA, valueB ] = [ randomString(), randomString() ]
      const { id: oldProperty } = await getProperty({ datatype: 'string', reserved: true })
      const { guid, hash } = await addQualifier({ property: oldProperty, value: valueA })
      await addQualifier({ guid, property: oldProperty, value: valueB })
      const { id: newProperty } = await getProperty({ datatype: 'string', reserved: true })
      const summary = randomString()
      await wbEdit.qualifier.move({ guid, hash, oldProperty, newProperty, summary })
      const comment = await getLastEditSummary(guid.split('$')[0])
      comment.should.endWith(summary)
    })
  })
})

const postAndGetEditSummary = (wbEdit, reqConfig, paramsArg) => {
  return wbEdit.entity.create(params(paramsArg), reqConfig)
  .then(getLastEditSummary)
}
