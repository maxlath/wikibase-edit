import 'should'
import nock from 'nock'
import request from '#lib/request/request'
import { shouldNotBeCalled, rethrowShouldNotBeCalledErrors } from '../integration/utils/utils.js'

describe('request', () => {
  beforeEach(() => {
    nock('https://example.org')
    .get('/')
    .reply(200, '<!doctype html>')
  })

  it('should throw a proper error', async () => {
    try {
      await request('get', { url: 'https://example.org', autoRetry: false }).then(shouldNotBeCalled)
    } catch (err) {
      rethrowShouldNotBeCalledErrors(err)
      err.message.should.equal('Could not parse response: <!doctype html>')
      err.name.should.equal('wrong response format')
    }
  })
})
