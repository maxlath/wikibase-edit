require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const addReference = wbEdit.reference.add
const { randomString } = __.require('test/unit/utils')
const { getSandboxClaimId, getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')

describe('reference add', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should add a reference', done => {
    Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string')
    ])
    .then(([ guid, property ]) => {
      const value = randomString()
      return addReference({ guid, property, value })
      .then((res) => {
        res.success.should.equal(1)
        res.reference.snaks[property].slice(-1)[0].datavalue.value.should.equal(value)
        done()
      })
    })
    .catch(done)
  })
})
