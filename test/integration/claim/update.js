require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { getSandboxPropertyId, getSandboxItemId } = __.require('test/integration/utils/sandbox_entities')

describe('claim update', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should find a claim from an item id, a property, and an old value, and update it', done => {
    Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('string')
    ])
    .then(([ id, property ]) => {
      return wbEdit.claim.add({ id, property, value: 'a' })
      .then(() => {
        return wbEdit.claim.update({ id, property, oldValue: 'a', newValue: 'b' })
      })
      .then(res => {
        res.success.should.equal(1)
        res.claim.mainsnak.datavalue.value.should.equal('b')
        done()
      })
    })
    .catch(done)
  })
})
