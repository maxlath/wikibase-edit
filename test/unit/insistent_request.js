require('should')
const { __ } = require('config')
const insistentReq = __.require('lib/request/insistent_req')
const { shouldNotGetHere, rethrowShouldNotGetHereErrors } = require('../integration/utils/utils')
const someUrlThatReturnsHtml = 'https://www.wikidata.org/w/api.php?action=help&modules=rollback'

describe('insistent_req', () => {
  it("should throw a wrong format error when the response isn't JSON", async () => {
    try {
      const res = await insistentReq('get', { url: someUrlThatReturnsHtml })
      shouldNotGetHere(res)
    } catch (err) {
      rethrowShouldNotGetHereErrors(err)
      err.message.should.startWith('Could not parse response: <!DOCTYPE html>')
      err.name.should.equal('wrong response format')
    }
  })
})
