require('should')
const addReference = require('../../lib/reference/add')
const { randomString, sandboxEntity: id, guid, properties } = require('../utils')

describe('reference add', () => {
  it('should rejected if not passed a claim guid', done => {
    addReference.bind(null, {}, properties).should.throw('missing guid')
    done()
  })

  it('should rejected if passed an invalid claim guid', done => {
    addReference.bind(null, { guid: 'some-invalid-guid' }, properties)
    .should.throw('invalid guid')
    done()
  })

  it('should rejected if not passed a property', done => {
    addReference.bind(null, { guid }, properties).should.throw('missing property')
    done()
  })

  it('should rejected if not passed a reference value', done => {
    addReference.bind(null, { guid, property: 'P143' }, properties)
    .should.throw('missing reference value')
    done()
  })

  it('should rejected if passed an invalid reference', done => {
    const params = { guid, property: 'P143', value: 'not-a-valid-reference' }
    addReference.bind(null, params, properties).should.throw('invalid entity value')
    done()
  })

  it('should set the action to wbsetreference', done => {
    const params = { guid, property: 'P143', value: 'Q1' }
    addReference(params, properties).action.should.equal('wbsetreference')
    done()
  })

  it('should format the data for a url', done => {
    const params = { guid, property: 'P854', value: 'http://foo.bar' }
    addReference(params, properties).data.should.deepEqual({
      statement: guid,
      snaks: '{"P854":[{"property":"P854","snaktype":"value","datavalue":{"type":"string","value":"http://foo.bar"}}]}'
    })
    done()
  })

  it('should add a reference with a special snaktype', done => {
    const params = { guid, property: 'P854', value: { snaktype: 'somevalue' } }
    addReference(params, properties).data.should.deepEqual({
      statement: guid,
      snaks: '{"P854":[{"snaktype":"somevalue","property":"P854"}]}'
    })
    done()
  })
})
