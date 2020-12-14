require('should')
const config = require('config')
const { instance, credentials, __ } = config
const WBEdit = __.require('.')
const { randomString } = require('../unit/utils')
const { getLastEditSummary } = require('./utils/utils')
const params = summary => ({ summary, labels: { en: randomString() } })

describe('summary', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

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
})

const postAndGetEditSummary = (wbEdit, reqConfig, paramsArg) => {
  return wbEdit.entity.create(params(paramsArg), reqConfig)
  .then(getLastEditSummary)
}
