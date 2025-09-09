import 'should'
import config from 'config'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import { undesiredRes, shouldNotBeCalled, rethrowShouldNotBeCalledErrors } from './utils/utils.js'
import type { EditEntitySimplifiedModeParams } from '#lib/entity/edit'

const { instance, credentials } = config

const params = () => ({ labels: { en: randomString() } } as EditEntitySimplifiedModeParams)

describe('credentials', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

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
      await wbEdit.entity.create(params()).then(shouldNotBeCalled)
    } catch (err) {
      rethrowShouldNotBeCalledErrors(err)
      err.message.should.equal('missing credentials')
    }
  })

  it('should allow defining credentials both at initialization and request time', async () => {
    const wbEdit = WBEdit({ credentials })
    const res = await wbEdit.entity.create(params(), { instance, credentials })
    res.success.should.equal(1)
  })

  it('should reject defining both oauth and username:password credentials', async () => {
    const creds = { username: 'abc', password: 'def', oauth: {} }
    const wbEdit = WBEdit({ instance, credentials: creds })
    try {
      await wbEdit.entity.create(params()).then(shouldNotBeCalled)
    } catch (err) {
      rethrowShouldNotBeCalledErrors(err)
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
