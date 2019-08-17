require('should')
const config = require('config')
const { instance, credentials, __ } = config
const wbk = require('wikibase-sdk')({ instance })
const WBEdit = __.require('.')
const { randomString } = require('../unit/utils')
const breq = require('bluereq')
const params = () => ({ labels: { en: randomString() } })
const toolSignature = '#wikidatajs/edit'

describe('summary', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should add a default summary', done => {
    const wbEdit = WBEdit({ instance, credentials })
    wbEdit.entity.create(params())
    .then(getEditSummary)
    .then(editSummary => {
      editSummary.should.endWith(toolSignature)
      done()
    })
    .catch(done)
  })

  it('should accept a custom summary in config', done => {
    const summary = 'some custom summary'
    const customConfig = Object.assign({ instance, credentials, summary })
    const wbEdit = WBEdit(customConfig)
    wbEdit.entity.create(params())
    .then(getEditSummary)
    .then(editSummary => {
      editSummary.should.endWith(`${summary} ${toolSignature}`)
      done()
    })
    .catch(done)
  })

  it('should accept a custom summary in the request config', done => {
    const summary = 'another custom summary'
    const wbEdit = WBEdit({ instance, credentials })
    wbEdit.entity.create(params(), { summary })
    .then(getEditSummary)
    .then(editSummary => {
      editSummary.should.endWith(`${summary} ${toolSignature}`)
      done()
    })
    .catch(done)
  })
})

const getEditSummary = res => {
  const { id } = res.entity
  const url = wbk.getRevisions(`Item:${id}`, { limit: 1 })
  return breq.get(url).get('body')
  .then(res => Object.values(res.query.pages)[0].revisions[0].comment)
}
