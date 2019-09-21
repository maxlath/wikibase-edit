require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const { getSandboxItemId } = __.require('test/integration/utils/sandbox_entities')
const language = 'fr'

describe('alias add', function () {
  this.timeout(24 * 60 * 60 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  xit('should renew tokens', done => {
    getSandboxItemId()
    .then(id => {
      const doActionRequiringAuthPeriodically = () => {
        const value = randomString()
        return wbEdit.alias.add({ id, language, value })
        .then(res => {
          res.success.should.equal(1)
          console.log(new Date().toISOString(), 'added alias', value)
          setTimeout(doActionRequiringAuthPeriodically, 60 * 1000)
        })
        .catch(done)
      }
      doActionRequiringAuthPeriodically()
    })
  })
})
