require('module-alias/register')
require('should')
const config = require('config')
const wbEdit = require('root')(config)
const { randomString } = require('test/unit/utils')

describe('entity merge', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('test/integration/utils/wait_for_instance'))

  // Do not run this test on the local instance as it currently fails
  // https://phabricator.wikimedia.org/T232925
  xit('should merge two items', async () => {
    const [ res1, res2 ] = await Promise.all([
      wbEdit.entity.create({ labels: { en: randomString() } }),
      wbEdit.entity.create({ labels: { en: randomString() } })
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
