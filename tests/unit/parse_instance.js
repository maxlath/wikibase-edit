require('should')
const parseInstance = require('lib/parse_instance')
const instance = 'https://hello.bla'
const apiEndpoint = `${instance}/w/api.php`

describe('parseInstance', () => {
  it('reject a missing instance', () => {
    parseInstance.bind(null, {}).should.throw('missing config parameter: instance')
  })

  it('return an instance and sparql endpoint', () => {
    const configA = { instance }
    const configB = { instance: apiEndpoint }
    parseInstance(configA)
    parseInstance(configB)
    configA.instance.should.equal(instance)
    configB.instance.should.equal(instance)
  })
})
