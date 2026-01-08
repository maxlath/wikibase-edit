import 'should'
import config from 'config'
import WBEdit from '../../../src/lib/index.js'
import { randomString } from '../../unit/utils.js'
import { addQualifier } from '../utils/sandbox_snaks.js'
import { waitForInstance } from '../utils/wait_for_instance.js'

const wbEdit = WBEdit(config)
const removeQualifier = wbEdit.qualifier.remove

describe('qualifier remove', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should remove a qualifier', async () => {
    const { guid, qualifier } = await addQualifier({ datatype: 'string', value: randomString() })
    const res = await removeQualifier({ guid, hash: qualifier.hash })
    res.success.should.equal(1)
  })

  it('should remove several qualifiers', async () => {
    const [ res1, res2 ] = await Promise.all([
      addQualifier({ datatype: 'string', value: randomString() }),
      addQualifier({ datatype: 'string', value: randomString() }),
    ])
    const res = await removeQualifier({
      guid: res1.guid,
      hash: [ res1.qualifier.hash, res2.qualifier.hash ],
    })
    res.success.should.equal(1)
  })
})
