require('should')
const { __, instance, credentials } = require('config')
const WBEdit = __.require('.')
const { randomString } = __.require('test/unit/utils')
const { undesiredRes } = require('./utils/utils')
const params = () => ({ labels: { en: randomString() } })

describe('credentials', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

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

  it('should reject undefined credentials', done => {
    const creds = { username: null, password: null }
    const wbEdit = WBEdit({ instance, credentials: creds })
    wbEdit.entity.create.bind(null, params())
    .should.throw('missing credentials')
    done()
  })

  it('should reject defining credentials both at initialization and request time', done => {
    const wbEdit = WBEdit({ credentials })
    wbEdit.entity.create.bind(null, params(), { instance, credentials })
    .should.throw('credentials should either be passed at initialization or per request')
    done()
  })

  it('should reject defining both oauth and username:password credentials', done => {
    const creds = { username: 'abc', password: 'def', oauth: {} }
    const wbEdit = WBEdit({ instance, credentials: creds })
    wbEdit.entity.create.bind(null, params())
    .should.throw('credentials can not be both oauth tokens, and a username and password')
    done()
  })

  // @TODO run a similar test for oauth
  if( !('oauth' in credentials) ) {
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
  }
})
