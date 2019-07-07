require('should')
const addReference = require('../../lib/reference/add')
const { randomString, sandboxEntity: id, guid } = require('../utils')

describe('reference add', () => {
  it('should rejected if not passed a claim guid', done => {
    try {
      addReference({})
    } catch (err) {
      err.message.should.equal('missing guid')
      done()
    }
  })

  it('should rejected if passed an invalid claim guid', done => {
    try {
      addReference({ guid: 'some-invalid-guid' })
    } catch (err) {
      err.message.should.equal('invalid guid')
      done()
    }
  })

  it('should rejected if not passed a property', done => {
    try {
      addReference({ guid })
    } catch (err) {
      err.message.should.equal('missing property')
      done()
    }
  })

  it('should rejected if not passed a reference value', done => {
    try {
      addReference({ guid, property: 'P143' })
    } catch (err) {
      err.message.should.equal('missing reference value')
      done()
    }
  })

  it('should rejected if passed an invalid reference', done => {
    try {
      addReference({ guid, property: 'P143', value: 'not-a-valid-reference' })
    } catch (err) {
      err.message.should.equal('invalid entity value')
      done()
    }
  })

  it('should set the action to wbsetreference', done => {
    addReference({
      guid,
      property: 'P143',
      datatype: 'WikibaseItem',
      value: 'Q1'
    })
    .action.should.equal('wbsetreference')
    done()
  })

  it('should format the data for wbsetreference', done => {
    addReference({
      guid,
      property: 'P854',
      datatype: 'Url',
      value: 'http://foo.bar'
    })
    .data.should.deepEqual({
      statement: guid,
      snaks: '{"P854":[{"property":"P854","snaktype":"value","datavalue":{"type":"string","value":"http://foo.bar"}}]}'
    })
    done()
  })

  it('should add a reference with a special snaktype', done => {
    addReference({
      guid,
      property: 'P854',
      datatype: 'Url',
      value: { snaktype: 'somevalue' }
    })
    .data.should.deepEqual({
      statement: guid,
      snaks: '{"P854":[{"snaktype":"somevalue","property":"P854"}]}'
    })
    done()
  })
})
