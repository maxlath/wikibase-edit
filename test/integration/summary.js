require('should')
const config = require('config')
const { instance, credentials, __ } = config
const wbk = require('wikibase-sdk')({ instance })
const WBEdit = __.require('.')
const { randomString } = require('../unit/utils')
const breq = require('bluereq')
const params = () => ({ labels: { en: randomString() } })
const toolSignature = '#wikibasejs/edit'
const resolveTitle = require('../../lib/resolve_title')

describe('summary', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should add a default summary', done => {
    const wbEdit = WBEdit({ instance, credentials })
    postAndGetEditSummary(wbEdit)
    .then(editSummary => {
      editSummary.should.endWith(` */ ${toolSignature}`)
      done()
    })
    .catch(done)
  })

  it('should accept a custom summary in config', done => {
    const summary = 'some custom summary'
    const customConfig = Object.assign({ instance, credentials, summary })
    const wbEdit = WBEdit(customConfig)
    postAndGetEditSummary(wbEdit)
    .then(editSummary => {
      editSummary.should.endWith(` */ ${summary}`)
      done()
    })
    .catch(done)
  })

  it('should accept a custom summary in the request config', done => {
    const summary = 'another custom summary'
    const wbEdit = WBEdit({ instance, credentials, summary: 'global summary' })
    postAndGetEditSummary(wbEdit, { summary })
    .then(editSummary => {
      editSummary.should.endWith(` */ ${summary}`)
      done()
    })
    .catch(done)
  })

  it('should not re-use the previous summary', done => {
    const summary = 'another custom summary'
    const wbEdit = WBEdit({ instance, credentials })
    postAndGetEditSummary(wbEdit, { summary })
    .then(editSummary => {
      editSummary.should.endWith(` */ ${summary}`)
      return postAndGetEditSummary(wbEdit)
      .then(editSummary2 => {
        editSummary2.should.endWith(` */ ${toolSignature}`)
        done()
      })
    })
    .catch(done)
  })
})

const postAndGetEditSummary = (wbEdit, reqConfig) => {
  return wbEdit.entity.create(params(), reqConfig)
  .then(getEditSummary)
}

const getEditSummary = res => {
  const { id } = res.entity
  return resolveTitle(id, instance)
  .then(title => {
    const url = wbk.getRevisions(title, { limit: 1 })
    return breq.get(url).get('body')
    .then(res => Object.values(res.query.pages)[0].revisions[0].comment)
  })
}
