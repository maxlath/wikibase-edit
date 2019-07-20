require('should')
const { instance, credentials } = require('config')
const WBEdit = require('../..')
const { randomString } = require('../utils')
// const { getSandboxProperty, getSandboxItem } = require('./utils')
// const language = 'fr'

describe('credentials', function () {
  this.timeout(20 * 1000)

  it('should accept config at initialization', done => {
    const wbEdit = WBEdit({ instance, credentials })
    const params = { labels: { en: randomString(4) } }
    wbEdit.entity.create(params)
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should accept credentials at request time', done => {
    const wbEdit = WBEdit({ instance })
    const params = { labels: { en: randomString(4) } }
    wbEdit.entity.create(params, { credentials })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should accept instance at request time', done => {
    const wbEdit = WBEdit()
    const params = { labels: { en: randomString(4) } }
    wbEdit.entity.create(params, { instance, credentials })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  // it('should reject defining credentials both at initialization and request time', done => {
  //   const wbEdit = WBEdit({ credentials })
  //   const params = { labels: { en: randomString(4) } }
  //   wbEdit.entity.create(params, { instance, credentials })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     done()
  //   })
  //   .catch(done)
  // })
})
