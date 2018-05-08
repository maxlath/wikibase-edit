require('should')
const { randomString, sandboxEntity } = require('../lib/tests_utils')
const CONFIG = require('config')
const AddAlias = require('../lib/alias/add')
const language = 'it'
const wdk = require('wikidata-sdk')
const getLastRev = wdk.getRevisions(sandboxEntity, { limit: 1 })
const breq = require('bluereq')

describe('summary', () => {
  it('should add a default summary', done => {
    doSomeEdit(CONFIG)
    .then(summary => {
      summary.should.endWith('#wikidatajs/edit')
      done()
    })
    .catch(done)
  })

  it('should accept a custom summary in config', done => {
    // Not cloning the CONFIG object as it is modified internally
    const customConfig = {
      username: CONFIG.username,
      password: CONFIG.password,
      verbose: CONFIG.verbose,
      summary: 'some custom summary'
    }
    doSomeEdit(customConfig)
    .then(summary => {
      summary.should.endWith('some custom summary')
      done()
    })
    .catch(done)
  })
})

const doSomeEdit = config => {
  const addAlias = AddAlias(config)
  return addAlias(sandboxEntity, language, randomString(4))
  .then(res => breq.get(getLastRev).get('body'))
  .then(res => Object.values(res.query.pages)[0].revisions[0].comment)
}
