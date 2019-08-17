require('should')
const { __, instance } = require('config')
const { guid, hash, properties } = __.require('test/unit/utils')
const _setQualifier = __.require('lib/qualifier/set')
const setQualifier = params => _setQualifier(params, properties, instance)

describe('qualifier set', () => {
  it('should rejected if not passed a claim guid', done => {
    setQualifier.bind(null, {}).should.throw('missing guid')
    done()
  })

  it('should rejected if passed an invalid claim guid', done => {
    const params = { guid: 'some-invalid-guid' }
    setQualifier.bind(null, params).should.throw('invalid guid')
    done()
  })

  it('should rejected if not passed a property', done => {
    const params = { guid }
    setQualifier.bind(null, params).should.throw('missing property')
    done()
  })

  it('should rejected if not passed a value', done => {
    const params = { guid, property: 'P155' }
    setQualifier.bind(null, params).should.throw('missing snak value')
    done()
  })

  it('should rejected if passed an invalid value', done => {
    const params = { guid, property: 'P155', value: 'not-a-valid-value' }
    setQualifier.bind(null, params).should.throw('invalid entity value')
    done()
  })

  it('should rejected if passed an hash', done => {
    const params = { guid, hash: 'foo', property: 'P155', value: 'Q123' }
    setQualifier.bind(null, params).should.throw('invalid hash')
    done()
  })

  it('should set the hash', done => {
    const params = { guid, hash, property: 'P155', value: 'Q123' }
    setQualifier(params).data.snakhash.should.equal(hash)
    done()
  })

  it('should set the action to wbsetreference', done => {
    const params = { guid, property: 'P155', value: 'Q123' }
    setQualifier(params).action.should.equal('wbsetqualifier')
    done()
  })

  it('should format the data for a string', done => {
    const params = { guid, property: 'P1545', value: '123' }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P1545',
      snaktype: 'value',
      value: '"123"'
    })
    done()
  })

  it('should set a time qualifier', done => {
    const params = { guid, property: 'P580', value: '1802-02' }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P580',
      snaktype: 'value',
      value: '{"time":"+1802-02-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":10,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should set a time qualifier with precision', done => {
    const params = { guid, property: 'P580', value: { time: '1802-02', precision: 10 } }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P580',
      snaktype: 'value',
      value: '{"time":"+1802-02-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":10,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should set a quantity qualifier', done => {
    const params = { guid, property: 'P2130', value: { amount: 123, unit: 'Q4916' } }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P2130',
      snaktype: 'value',
      value: `{"amount":"+123","unit":"${instance}/entity/Q4916"}`
    })
    done()
  })

  it('should set a monolingualtext qualifier', done => {
    const params = { guid, property: 'P3132', value: { text: 'foo', language: 'fr' } }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P3132',
      snaktype: 'value',
      value: '{"text":"foo","language":"fr"}'
    })
    done()
  })

  it('should set a qualifier with a special snaktype', done => {
    const params = { guid, property: 'P578', value: { snaktype: 'novalue' } }
    setQualifier(params).data.should.deepEqual({
      claim: guid,
      property: 'P578',
      snaktype: 'novalue'
    })
    done()
  })
})
