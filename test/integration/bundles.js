require('should')
const config = require('config')
const wbEdit = require('../..')(config)
const { randomString } = require('../utils')
const { getSandboxPropertyId, getSandboxItemId, getRefreshedEntity } = require('./sandbox_entities')

describe('bundles', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('./wait_for_instance'))

  describe('claim.update', () => {
    it('should update a claim', done => {
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
})
