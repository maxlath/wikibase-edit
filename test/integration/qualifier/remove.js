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

  it('should remove a qualifier', async () => {
    const { guid, qualifier } = await addQualifier({ datatype: 'string', value: randomString() })
    const res = await removeQualifier({ guid, hash: qualifier.hash })
    res.success.should.equal(1)
  })

  it('should remove several qualifiers', async () => {
    const [ res1, res2 ] = await Promise.all([
      addQualifier({ datatype: 'string', value: randomString() }),
      addQualifier({ datatype: 'string', value: randomString() })
    ])
    const res = await removeQualifier({
      guid: res1.guid,
      hash: [ res1.qualifier.hash, res2.qualifier.hash ]
    })
    res.success.should.equal(1)
  })
})
