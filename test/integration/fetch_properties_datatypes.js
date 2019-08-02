require('should')
const config = require('config')
const { __ } = config
const { getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')
const fetchPropertiesDatatypes = __.require('lib/properties/fetch_properties_datatypes')
const { validateAndEnrichConfig } = __.require('lib/wrappers_utils')
// Set config.wbk
validateAndEnrichConfig(config)

describe('fetch properties datatypes', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should fetch a property datatype', done => {
    getSandboxPropertyId('wikibase-item')
    .then(propertyId => {
      return fetchPropertiesDatatypes(config, [ propertyId ])
      .then(() => {
        config.properties.should.be.an.Object()
        const datatype = config.properties[propertyId]
        datatype.should.equal('wikibase-item')
        done()
      })
    })
    .catch(done)
  })
})
