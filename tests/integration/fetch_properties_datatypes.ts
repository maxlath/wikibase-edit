import 'should'
import config from 'config'
import { fetchPropertiesDatatypes } from '../../src/lib/properties/fetch_properties_datatypes.js'
import { getSandboxPropertyId } from './utils/sandbox_entities.js'
import { undesiredRes } from './utils/utils.js'
import { waitForInstance } from './utils/wait_for_instance.js'

describe('fetch properties datatypes', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

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
