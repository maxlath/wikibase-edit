require('should')
const config = require('config')
const { __ } = config
const { undesiredRes } = require('./utils/utils')
const { getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')
const fetchPropertiesDatatypes = __.require('lib/properties/fetch_properties_datatypes')

describe('fetch properties datatypes', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should fetch a property datatype', async () => {
    const propertyId = await getSandboxPropertyId('wikibase-item')
    await fetchPropertiesDatatypes(config, [ propertyId ])
    config.properties.should.be.an.Object()
    const datatype = config.properties[propertyId]
    datatype.should.equal('wikibase-item')
  })

  it("should throw when it can't find the property datatype", done => {
    fetchPropertiesDatatypes(config, [ 'P999999' ])
    .then(undesiredRes(done))
    .catch(err => {
      err.message.should.equal('property not found')
      done()
    })
    .catch(done)
  })
})
