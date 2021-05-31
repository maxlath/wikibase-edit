require('should')
const parseInstance = require('lib/parse_instance')
const instance = 'https://hello.bla'
const apiEndpoint = `${instance}/w/api.php`

describe('parseInstance', () => {
  it('reject a missing instance', () => {
    parseInstance.bind(null, {}).should.throw('missing config parameter: instance')
  })

  it('should return an instance and sparql endpoint', () => {
    const configA = { instance }
    const configB = { instance: apiEndpoint }
    parseInstance(configA)
    parseInstance(configB)
    configA.instance.should.equal(instance)
    configB.instance.should.equal(instance)
  })

  it('should allow to customize the script path', () => {
    const configA = { instance, wgScriptPath: 'foo' }
    const configB = { instance, wgScriptPath: '/foo' }
    parseInstance(configA)
    configA.instanceApiEndpoint.should.equal(`${instance}/foo/api.php`)
    parseInstance(configB)
    configB.instanceApiEndpoint.should.equal(`${instance}/foo/api.php`)
  })
})
