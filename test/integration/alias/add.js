require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const { getSandboxItemId } = __.require('test/integration/utils/sandbox_entities')
const language = 'fr'

describe('alias add', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should add an alias', done => {
    getSandboxItemId()
    .then(id => {
      const value = randomString()
      return wbEdit.alias.add({ id, language, value })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should add several aliases', done => {
    getSandboxItemId()
    .then(id => {
      const aliases = [
        randomString(),
        randomString(),
        randomString(),
        randomString()
      ]
      console.log('aliases', aliases)
      return wbEdit.alias.add({ id, language, value: aliases })
      .then(res => {
        console.log('res', res)
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })
})
