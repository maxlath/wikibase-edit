require('should')
const config = require('config')
const wbEdit = require('root')(config)
const removeReference = wbEdit.reference.remove
const { randomString } = require('test/unit/utils')
const { addReference } = require('test/integration/utils/sandbox_snaks')

describe('reference remove', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('test/integration/utils/wait_for_instance'))

  it('should remove a reference', async () => {
    const { guid, reference } = await addReference({ datatype: 'string', value: randomString() })
    const res = await removeReference({ guid, hash: reference.hash })
    res.success.should.equal(1)
  })

  it('should remove several qualifiers', async () => {
    const [ res1, res2 ] = await Promise.all([
      addReference({ datatype: 'string', value: randomString() }),
      addReference({ datatype: 'string', value: randomString() })
    ])
    const res3 = await removeReference({
      guid: res1.guid,
      hash: [ res1.reference.hash, res2.reference.hash ]
    })
    res3.success.should.equal(1)
  })
})
