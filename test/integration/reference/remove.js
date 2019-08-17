require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const removeReference = wbEdit.reference.remove
const { randomString } = __.require('test/unit/utils')
const { addReference } = __.require('test/integration/utils/sandbox_snaks')

describe('reference remove', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should remove a reference', done => {
    addReference('string', randomString())
    .then(({ guid, property, reference }) => {
      return removeReference({ guid, hash: reference.hash })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should remove several qualifiers', done => {
    Promise.all([
      addReference('string', randomString()),
      addReference('string', randomString())
    ])
    .then(([ res1, res2 ]) => {
      return removeReference({
        guid: res1.guid,
        hash: [ res1.reference.hash, res2.reference.hash ]
      })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })
})
