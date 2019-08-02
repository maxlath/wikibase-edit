require('should')
const { __ } = require('config')
const addQualifier = __.require('lib/qualifier/add')
const { guid, properties } = __.require('test/unit/utils')

describe('qualifier add', () => {
  it('should rejected if not passed a claim guid', done => {
    addQualifier.bind(null, {}).should.throw('missing guid')
    done()
  })

  it('should rejected if passed an invalid claim guid', done => {
    const params = { guid: 'some-invalid-guid' }
    addQualifier.bind(null, params, properties).should.throw('invalid guid')
    done()
  })

  it('should rejected if not passed a property', done => {
    const params = { guid }
    addQualifier.bind(null, params, properties).should.throw('missing property')
    done()
  })

  it('should rejected if not passed a value', done => {
    const params = { guid, property: 'P155' }
    addQualifier.bind(null, params, properties).should.throw('missing qualifier value')
    done()
  })

  it('should rejected if passed an invalid value', done => {
    const params = { guid, property: 'P155', value: 'not-a-valid-value' }
    addQualifier.bind(null, params, properties).should.throw('invalid entity value')
    done()
  })

  it('should set the action to wbsetreference', done => {
    const params = { guid, property: 'P155', value: 'Q123' }
    addQualifier(params, properties).action.should.equal('wbsetqualifier')
    done()
  })

  it('should format the data for a string', done => {
    const params = { guid, property: 'P1545', value: '123' }
    addQualifier(params, properties).data.should.deepEqual({
      claim: guid,
      property: 'P1545',
      snaktype: 'value',
      value: '"123"'
    })
    done()
  })

  it('should add a time qualifier', done => {
    const params = { guid, property: 'P580', value: '1802-02' }
    addQualifier(params, properties).data.should.deepEqual({
      claim: guid,
      property: 'P580',
      snaktype: 'value',
      value: '{"time":"+1802-02-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":10,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should add a time qualifier with precision', done => {
    const params = { guid, property: 'P580', value: { time: '1802-02', precision: 10 } }
    addQualifier(params, properties).data.should.deepEqual({
      claim: guid,
      property: 'P580',
      snaktype: 'value',
      value: '{"time":"+1802-02-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":10,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should add a quantity qualifier', done => {
    const params = { guid, property: 'P2130', value: { amount: 123, unit: 'Q4916' } }
    addQualifier(params, properties).data.should.deepEqual({
      claim: guid,
      property: 'P2130',
      snaktype: 'value',
      value: '{"amount":"+123","unit":"http://www.wikidata.org/entity/Q4916"}'
    })
    done()
  })

  it('should add a monolingualtext qualifier', done => {
    const params = { guid, property: 'P3132', value: { text: 'foo', language: 'fr' } }
    addQualifier(params, properties).data.should.deepEqual({
      claim: guid,
      property: 'P3132',
      snaktype: 'value',
      value: '{"text":"foo","language":"fr"}'
    })
    done()
  })

  it('should add a qualifier with a special snaktype', done => {
    const params = { guid, property: 'P578', value: { snaktype: 'novalue' } }
    addQualifier(params, properties).data.should.deepEqual({
      claim: guid,
      property: 'P578',
      snaktype: 'novalue'
    })
    done()
  })
})
