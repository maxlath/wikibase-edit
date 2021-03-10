require('module-alias/register')
require('should')
const { instance } = require('config')
const { guid, hash, properties } = require('tests/unit/utils')
const _setQualifier = require('lib/qualifier/set')
const setQualifier = params => _setQualifier(params, properties, instance)

describe('qualifier set', () => {
  it('should rejected if not passed a claim guid', () => {
    setQualifier.bind(null, {}).should.throw('missing guid')
  })

  it('should rejected if passed an invalid claim guid', () => {
    const params = { guid: 'some-invalid-guid' }
    setQualifier.bind(null, params).should.throw('invalid guid')
  })

  it('should rejected if not passed a property', () => {
    const params = { guid }
    setQualifier.bind(null, params).should.throw('missing property')
  })

  it('should rejected if not passed a value', () => {
    const params = { guid, property: 'P2' }
    setQualifier.bind(null, params).should.throw('missing snak value')
  })

  it('should rejected if passed an invalid value', () => {
    const params = { guid, property: 'P2', value: 'not-a-valid-value' }
    setQualifier.bind(null, params).should.throw('invalid entity value')
  })

  it('should rejected if passed an hash', () => {
    const params = { guid, hash: 'foo', property: 'P2', value: 'Q123' }
    setQualifier.bind(null, params).should.throw('invalid hash')
  })

  it('should set the hash', () => {
    const params = { guid, hash, property: 'P2', value: 'Q123' }
    setQualifier(params).data.snakhash.should.equal(hash)
  })

  it('should set the action to wbsetreference', () => {
    const params = { guid, property: 'P2', value: 'Q123' }
    setQualifier(params).action.should.equal('wbsetqualifier')
  })

  it('should format the data for a string', () => {
    const params = { guid, property: 'P1', value: '123' }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P1',
      snaktype: 'value',
      value: '"123"'
    })
  })

  it('should set a time qualifier', () => {
    const params = { guid, property: 'P4', value: '1802-02' }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P4',
      snaktype: 'value',
      value: '{"time":"+1802-02-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":10,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
  })

  it('should set a time qualifier with precision', () => {
    const params = { guid, property: 'P4', value: { time: '1802-02', precision: 10 } }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P4',
      snaktype: 'value',
      value: '{"time":"+1802-02-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":10,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
  })

  it('should set a quantity qualifier', () => {
    const params = { guid, property: 'P8', value: { amount: 123, unit: 'Q4916' } }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P8',
      snaktype: 'value',
      value: `{"amount":"+123","unit":"${instance}/entity/Q4916"}`
    })
  })

  it('should set a monolingualtext qualifier', () => {
    const params = { guid, property: 'P9', value: { text: 'foo', language: 'fr' } }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P9',
      snaktype: 'value',
      value: '{"text":"foo","language":"fr"}'
    })
  })

  it('should set a qualifier with a special snaktype', () => {
    const params = { guid, property: 'P4', value: { snaktype: 'novalue' } }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P4',
      snaktype: 'novalue'
    })
  })
})
