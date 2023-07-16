import 'should'
import config from 'config'
import { getSandboxItemId } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)
const language = 'fr'

describe('alias remove', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should remove an alias', async () => {
    const id = await getSandboxItemId()
    const value = randomString()
    const res = await wbEdit.alias.remove({ id, language, value })
    res.success.should.equal(1)
  })
})
