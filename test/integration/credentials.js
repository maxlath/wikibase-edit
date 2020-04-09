require('should')
const { __, instance, credentials } = require('config')
const WBEdit = __.require('.')
const { randomString } = __.require('test/unit/utils')
const { undesiredRes, shouldNotGetHere, rethrowShouldNotGetHereErrors } = require('./utils/utils')
const params = () => ({ labels: { en: randomString() } })

describe('credentials', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should accept config at initialization', async () => {
    const wbEdit = WBEdit({ instance, credentials })
    const res = await wbEdit.entity.create(params())
    res.success.should.equal(1)
  })

  it('should accept credentials at request time', async () => {
    const wbEdit = WBEdit({ instance })
    const res = await wbEdit.entity.create(params(), { credentials })
    res.success.should.equal(1)
  })

  it('should accept instance at request time', async () => {
    const wbEdit = WBEdit()
    const res = await wbEdit.entity.create(params(), { instance, credentials })
    res.success.should.equal(1)
  })

  it('should reject undefined credentials', async () => {
    const creds = { username: null, password: null }
    const wbEdit = WBEdit({ instance, credentials: creds })
    try {
      const res = await wbEdit.entity.create(params())
      shouldNotGetHere(res)
    } catch (err) {
      rethrowShouldNotGetHereErrors(err)
      err.message.should.equal('missing credentials')
    }
  })

  it('should reject defining credentials both at initialization and request time', async () => {
    const wbEdit = WBEdit({ credentials })
    try {
      const res = await wbEdit.entity.create(params(), { instance, credentials })
      shouldNotGetHere(res)
    } catch (err) {
      rethrowShouldNotGetHereErrors(err)
      err.message.should.equal('credentials should either be passed at initialization or per request')
    }
  })

  it('should reject defining both oauth and username:password credentials', async () => {
    const creds = { username: 'abc', password: 'def', oauth: {} }
    const wbEdit = WBEdit({ instance, credentials: creds })
    try {
      const res = await wbEdit.entity.create(params())
      shouldNotGetHere(res)
    } catch (err) {
      rethrowShouldNotGetHereErrors(err)
      err.message.should.equal('credentials can not be both oauth tokens, and a username and password')
    }
  })

  // TODO: run a similar test for oauth
  if (!('oauth' in credentials)) {
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
