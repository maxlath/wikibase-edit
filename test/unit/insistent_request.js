require('should')
const { __ } = require('config')
const insistentReq = __.require('lib/request/insistent_req')
const nock = require('nock')
const { shouldNotGetHere, rethrowShouldNotGetHereErrors } = require('../integration/utils/utils')

describe('insistent_req', () => {
  beforeEach(() => {
    nock('https://example.org')
    .get('/')
    .reply(200, '<!doctype html>')
  })

  it('should throw a proper error', async () => {
    try {
      const res = await insistentReq('get', { url: 'https://example.org' })
      shouldNotGetHere(res)
    } catch (err) {
      rethrowShouldNotGetHereErrors(err)
      err.message.should.equal('Could not parse response: <!doctype html>')
      err.name.should.equal('wrong response format')
    }
  })
})
