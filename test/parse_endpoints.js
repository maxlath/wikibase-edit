const should = require('should')
const parseEndpoints = require('../lib/parse_endpoints')
const wdk = require('wikidata-sdk')
const sparqlEndpoint = 'https://foo.bar/sparql'
const instance = 'https://hello.bla'
const apiEndpoint = `${instance}/w/api.php`

describe('parseEndpoints', () => {
  it('reject a missing instance', done => {
    parseEndpoints.should.throw('missing config parameter: instance')
    done()
  })
  it('reject a missing sparql endpoint', done => {
    (() => parseEndpoints({ instance }))
    .should.throw('missing config parameter: sparqlEndpoint')
    done()
  })
  it('return an instance and sparql endpoint', done => {
    parseEndpoints({ instance, sparqlEndpoint })
    .should.deepEqual({ instance: apiEndpoint, sparqlEndpoint })
    parseEndpoints({ instance: apiEndpoint, sparqlEndpoint })
    .should.deepEqual({ instance: apiEndpoint, sparqlEndpoint })
    done()
  })
})
