require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')

describe('entity delete', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should delete an item', done => {
    wbEdit.entity.create({ labels: { en: randomString() } })
    .then(res => {
      const { id } = res.entity
      return wbEdit.entity.delete({ id })
      .then(res => {
        res.delete.title.should.match(id)
        done()
      })
    })
    .catch(done)
  })

  it('should delete a property', done => {
    wbEdit.entity.create({
      type: 'property',
      datatype: 'string',
      labels: { en: randomString() }
    })
    .then(res => {
      const { id } = res.entity
      return wbEdit.entity.delete({ id })
      .then(res => {
        res.delete.title.should.equal(`Property:${id}`)
        done()
      })
    })
    .catch(done)
  })
})
