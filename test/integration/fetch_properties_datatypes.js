require('should')
const config = require('config')
const wbEdit = require('../..')(config)
const { createProperty } = require('./utils')
const fetchPropertiesDatatypes = require('../../lib/properties/fetch_properties_datatypes')

describe('fetch properties datatypes', function () {
  this.timeout(20 * 1000)

  it('should fetch a property datatype', done => {
    createProperty('wikibase-item')
    .then(propertyId => {
      return fetchPropertiesDatatypes(config, [ propertyId ])
      .then(() => {
        config.properties.should.be.an.Object()
        console.log('config.properties', config.properties)
        const datatype = config.properties[propertyId]
        datatype.should.equal('wikibase-item')
        done()
      })
    })
    .catch(done)
  })
})
