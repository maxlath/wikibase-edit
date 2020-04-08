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

  it('should remove a reference', async () => {
    const { guid, reference } = await addReference('string', randomString())
    const res = await removeReference({ guid, hash: reference.hash })
    res.success.should.equal(1)
  })

  it('should remove several qualifiers', async () => {
    const [ res1, res2 ] = await Promise.all([
      addReference('string', randomString()),
      addReference('string', randomString())
    ])
    const res3 = await removeReference({
      guid: res1.guid,
      hash: [ res1.reference.hash, res2.reference.hash ]
    })
    res3.success.should.equal(1)
  })
})
