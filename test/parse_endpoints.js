const should = require('should')
const parseEndpoints = require('../lib/parse_endpoints')
const wdk = require('wikidata-sdk')
const instance = 'https://hello.bla'
const apiEndpoint = `${instance}/w/api.php`

describe('parseEndpoints', () => {
  it('reject a missing instance', done => {
    parseEndpoints.should.throw('missing config parameter: instance')
    done()
  })
  it('return an instance and sparql endpoint', done => {
    parseEndpoints({ instance }).should.deepEqual({ instance: apiEndpoint })
    parseEndpoints({ instance: apiEndpoint }).should.deepEqual({ instance: apiEndpoint })
    done()
  })
})
