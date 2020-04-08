require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')

describe('entity delete', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should delete an item', async () => {
    const resA = await wbEdit.entity.create({ labels: { en: randomString() } })
    const { id } = resA.entity
    const resB = await wbEdit.entity.delete({ id })
    resB.delete.title.should.endWith(id)
  })

  it('should delete a property', async () => {
    const resA = await wbEdit.entity.create({
      type: 'property',
      datatype: 'string',
      labels: { en: randomString() }
    })
    const { id } = resA.entity
    const resB = await wbEdit.entity.delete({ id })
    resB.delete.title.should.equal(`Property:${id}`)
  })
})
