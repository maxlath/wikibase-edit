const should = require('should')
const parseInstance = require('../lib/parse_instance')
const instance = 'https://hello.bla'
const apiEndpoint = `${instance}/w/api.php`

describe('parseInstance', () => {
  it('reject a missing instance', done => {
    parseInstance.should.throw('missing config parameter: instance')
    done()
  })

  it('return an instance and sparql endpoint', done => {
    parseInstance({ instance }).should.equal(apiEndpoint)
    parseInstance({ instance: apiEndpoint }).should.equal(apiEndpoint)
    done()
  })
})
