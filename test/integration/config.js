require('should')
const { instance, credentials } = require('config')
const WBEdit = require('../..')
const { randomString, } = require('../utils')
const { undesiredRes } = require('./utils')
const params = () => ({ labels: { en: randomString(4) } })

describe('credentials', function () {
  this.timeout(20 * 1000)

  it('should accept config at initialization', done => {
    const wbEdit = WBEdit({ instance, credentials })
    wbEdit.entity.create(params())
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should accept credentials at request time', done => {
    const wbEdit = WBEdit({ instance })
    wbEdit.entity.create(params(), { credentials })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should accept instance at request time', done => {
    const wbEdit = WBEdit()
    wbEdit.entity.create(params(), { instance, credentials })
    .then(res => {
      res.success.should.equal(1)
      done()
    })
    .catch(done)
  })

  it('should reject defining credentials both at initialization and request time', done => {
    const wbEdit = WBEdit({ credentials })
    wbEdit.entity.create.bind(null, params(), { instance, credentials })
    .should.throw('credentials should either be passed at initialization or per request')
    done()
  })

  it('should reject defining both oauth and username:password credentials', done => {
    const { username, password } = credentials
    const creds = { username, password, oauth: {} }
    const wbEdit = WBEdit({ instance, credentials: creds })
    wbEdit.entity.create.bind(null, params())
    .should.throw('credentials should either be oauth tokens or a username and password')
    done()
  })

  it('should re-generate credentials when re-using a pre-existing credentials object', done => {
    const wbEdit = WBEdit({ instance })
    const creds = Object.assign({}, credentials)
    wbEdit.entity.create(params(), { credentials: creds })
    .then(() => {
        creds.username = 'foo'
      return wbEdit.entity.create(params(), { credentials: creds })
    })
    .then(undesiredRes(done))
    .catch(err => {
      err.body.error.code.should.equal('assertuserfailed')
      done()
    })
    .catch(done)
  })
})
