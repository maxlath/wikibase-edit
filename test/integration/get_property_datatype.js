require('should')
const CONFIG = require('config')
const wbEdit = require('../..')(CONFIG)
const { createProperty } = require('./utils')
const getPropertyDatatype = require('../../lib/properties/get_property_datatype')

describe('get property datatype', function () {
  this.timeout(20 * 1000)

  it('should get a property datatype', done => {
    createProperty()
    .then(propertyId => {
      console.log({ propertyId })
      return getPropertyDatatype(CONFIG, propertyId)
      .then(datatype => {
        console.log({ datatype })
        datatype.should.equal('string')
        done()
      })
    })
    .catch(done)
  })
})
