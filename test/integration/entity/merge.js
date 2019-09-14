require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')

describe('entity merge', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should merge two items', done => {
    Promise.all([
      wbEdit.entity.create({ labels: { en: randomString() } }),
      wbEdit.entity.create({ labels: { en: randomString() } })
    ])
    .then(([ res1, res2 ]) => {
      const { id: from } = res1.entity
      const { id: to } = res2.entity
      return wbEdit.entity.merge({ from, to })
      .then(res => {
        res.success.should.equal(1)
        res.redirected.should.equal(1)
        res.from.id.should.equal(from)
        res.to.id.should.equal(to)
        done()
      })
    })
    .catch(done)
  })
})
