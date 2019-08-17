require('should')
const { __ } = require('config')
const setReference = __.require('lib/reference/set')
const { guid, properties } = __.require('test/unit/utils')

describe('reference set', () => {
  it('should rejected if not passed a claim guid', done => {
    setReference.bind(null, {}, properties).should.throw('missing guid')
    done()
  })

  it('should rejected if passed an invalid claim guid', done => {
    setReference.bind(null, { guid: 'some-invalid-guid' }, properties)
    .should.throw('invalid guid')
    done()
  })

  it('should rejected if not passed a property', done => {
    setReference.bind(null, { guid }, properties).should.throw('missing property')
    done()
  })

  it('should rejected if not passed a reference value', done => {
    setReference.bind(null, { guid, property: 'P143' }, properties)
    .should.throw('missing snak value')
    done()
  })

  it('should rejected if passed an invalid reference', done => {
    const params = { guid, property: 'P143', value: 'not-a-valid-reference' }
    setReference.bind(null, params, properties).should.throw('invalid entity value')
    done()
  })

  it('should set the action to wbsetreference', done => {
    const params = { guid, property: 'P143', value: 'Q1' }
    setReference(params, properties).action.should.equal('wbsetreference')
    done()
  })

  it('should format the data for a url', done => {
    const params = { guid, property: 'P854', value: 'http://foo.bar' }
    setReference(params, properties).data.should.deepEqual({
      statement: guid,
      snaks: '{"P854":[{"property":"P854","snaktype":"value","datavalue":{"type":"string","value":"http://foo.bar"}}]}'
    })
    done()
  })

  it('should set a reference with a special snaktype', done => {
    const params = { guid, property: 'P854', value: { snaktype: 'somevalue' } }
    setReference(params, properties).data.should.deepEqual({
      statement: guid,
      snaks: '{"P854":[{"snaktype":"somevalue","property":"P854"}]}'
    })
    done()
  })
})
