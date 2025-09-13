import 'should'
import config from 'config'
import { getSandboxItemId } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import { undesiredRes } from './utils/utils.js'

describe('maxlag', function () {
  this.timeout(120 * 1000)
  before('wait for instance', waitForInstance)

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

async function doAction (wbEdit, reqConfig?) {
  const id = await getSandboxItemId()
  const params = { id, language: 'fr', value: randomString() }
  return wbEdit.alias.add(params, reqConfig)
}
