import 'should'
import config from 'config'
import WBEdit from '../../../src/lib/index.js'
import { randomString } from '../../unit/utils.js'
import { getSandboxItemId } from '../utils/sandbox_entities.js'
import { waitForInstance } from '../utils/wait_for_instance.js'

const wbEdit = WBEdit(config)
const language = 'fr'

describe('alias add', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should add an alias', async () => {
    const id = await getSandboxItemId()
    const value = randomString()
    const res = await wbEdit.alias.add({ id, language, value })
    res.success.should.equal(1)
  })

  it('should add several aliases', async () => {
    const id = await getSandboxItemId()
    const aliases = [
      randomString(),
      randomString(),
      randomString(),
      randomString(),
    ]
    const res = await wbEdit.alias.add({ id, language, value: aliases })
    res.success.should.equal(1)
  })
})
