require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = require('../unit/utils')
const { getSandboxItemId, getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')
const breq = require('bluereq')

describe('summary', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should add a default summary', done => {
    doSomeEdit(config)
    .then(summary => {
      summary.should.endWith('#wikidatajs/edit')
      done()
    })
    .catch(done)
  })

  it('should accept a custom summary in config', done => {
    // Not cloning the config object as it is modified internally
    const summary = 'some custom summary'
    const customConfig = Object.assign({}, config, { summary })
    doSomeEdit(customConfig)
    .then(summary => {
      summary.should.endWith(summary)
      done()
    })
    .catch(done)
  })
})

const doSomeEdit = config => {
  return Promise.all([
    getSandboxItemId(),
    getSandboxPropertyId('string')
  ])
  .then(([ id, property ]) => {
    const value = randomString()
    return wbEdit.claim.create({ id, property, value })
    .then(res => {
      const { instance } = config
      const wbk = require('wikibase-sdk')({ instance })
      const url = wbk.getRevisions(`Item:${id}`, { limit: 1 })
      return breq.get(url).get('body')
    })
    .then(res => Object.values(res.query.pages)[0].revisions[0].comment)
  })
}
