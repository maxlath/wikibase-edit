require('should')
const config = require('config')
const { instance, credentials, __ } = config
const wbk = require('wikibase-sdk')({ instance })
const WBEdit = __.require('.')
const { randomString } = require('../unit/utils')
const breq = require('bluereq')
const params = () => ({ labels: { en: randomString() } })
const resolveTitle = require('../../lib/resolve_title')

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
})

const postAndGetEditSummary = (wbEdit, reqConfig) => {
  return wbEdit.entity.create(params(), reqConfig)
  .then(getEditSummary)
}

const getEditSummary = async res => {
  const { id } = res.entity
  const title = await resolveTitle(id, instance)
  const url = wbk.getRevisions(title, { limit: 1 })
  const { query } = await breq.get(url).get('body')
  return Object.values(query.pages)[0].revisions[0].comment
}
