import 'should'
import config from 'config'
import WBEdit from '../../../src/lib/index.js'
import { randomString } from '../../unit/utils.js'
import { waitForInstance } from '../utils/wait_for_instance.js'
import type { EditEntitySimplifiedModeParams } from '../../../src/lib/entity/edit.js'

const wbEdit = WBEdit(config)

describe('entity merge', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  // Do not run this test on the local instance as it currently fails
  // https://phabricator.wikimedia.org/T232925
  xit('should merge two items', async () => {
    const [ res1, res2 ] = await Promise.all([
      wbEdit.entity.create({ labels: { en: randomString() } } as EditEntitySimplifiedModeParams),
      wbEdit.entity.create({ labels: { en: randomString() } } as EditEntitySimplifiedModeParams),
    ])
    const { id: from } = res1.entity
    const { id: to } = res2.entity
    const res3 = await wbEdit.entity.merge({ from, to })
    res3.success.should.equal(1)
    res3.redirected.should.equal(1)
    res3.from.id.should.equal(from)
    res3.to.id.should.equal(to)
  })
})
