require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = require('../unit/utils')
const { getSandboxItem, getRefreshedEntity } = require('./utils/sandbox_entities')
const { shouldNotBeCalled } = require('./utils/utils')

describe('baserevid', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should reject when passed an invalid baserevid', async () => {
    const { id } = await getSandboxItem()
    await wbEdit.label.set({
      id,
      language: 'fr',
      value: randomString(),
    }, {
      baserevid: 1
    })
    .then(shouldNotBeCalled)
    .catch(err => {
      err.body.error.code.should.equal('cant-load-entity-content')
    })
  })

  it('should accept a valid baserevid', async () => {
    const { id } = await getSandboxItem()
    const { lastrevid } = await getRefreshedEntity(id)
    const res = await wbEdit.label.set({
      id,
      language: 'fr',
      value: randomString(),
    }, {
      baserevid: lastrevid
    })
    res.success.should.equal(1)
    res.entity.lastrevid.should.equal(lastrevid + 1)
  })
})
