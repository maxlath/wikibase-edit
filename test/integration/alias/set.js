require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const { getSandboxItemId } = __.require('test/integration/utils/sandbox_entities')
const language = 'fr'

describe('alias set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should set an alias', done => {
    getSandboxItemId()
    .then(id => {
      const value = randomString()
      return wbEdit.alias.set({ id, language, value })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })
})
