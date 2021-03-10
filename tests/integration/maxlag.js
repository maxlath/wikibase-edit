require('module-alias/register')
require('should')
const config = require('config')
const WBEdit = require('root')
const { randomString } = require('tests/unit/utils')
const { undesiredRes } = require('./utils/utils')
const { getSandboxItemId } = require('tests/integration/utils/sandbox_entities')

describe('maxlag', function () {
  this.timeout(120 * 1000)
  before('wait for instance', require('tests/integration/utils/wait_for_instance'))

  it('should accept a maxlag from initialization configuration', done => {
    const customConfig = Object.assign({ maxlag: -100, autoRetry: false }, config)
    const wbEdit = WBEdit(customConfig)
    doAction(wbEdit)
    .then(undesiredRes(done))
    .catch(err => {
      err.body.error.code.should.equal('maxlag')
      done()
    })
    .catch(done)
  })

  it('should accept a maxlag from request configuration', done => {
    const customConfig = Object.assign({ maxlag: 100, autoRetry: false }, config)
    const wbEdit = WBEdit(customConfig)
    doAction(wbEdit, { maxlag: -100 })
    .then(undesiredRes(done))
    .catch(err => {
      err.body.error.code.should.equal('maxlag')
      done()
    })
    .catch(done)
  })
})

const doAction = async (wbEdit, reqConfig) => {
  const id = await getSandboxItemId()
  const params = { id, language: 'fr', value: randomString() }
  return wbEdit.alias.add(params, reqConfig)
}
