require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const removeQualifier = wbEdit.qualifier.remove
const { randomString } = __.require('test/unit/utils')
const { addQualifier } = __.require('test/integration/utils/sandbox_snaks')

describe('qualifier remove', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should remove a qualifier', done => {
    addQualifier('string', randomString())
    .then(({ guid, property, qualifier }) => {
      return removeQualifier({ guid, hash: qualifier.hash })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })

  it('should remove several qualifiers', done => {
    Promise.all([
      addQualifier('string', randomString()),
      addQualifier('string', randomString())
    ])
    .then(([ res1, res2 ]) => {
      return removeQualifier({
        guid: res1.guid,
        hash: [ res1.qualifier.hash, res2.qualifier.hash ]
      })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })
})
