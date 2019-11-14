require('should')
const { __, instance } = require('config')
const createClaim = __.require('lib/claim/create')
const { someEntityId: id, properties } = __.require('test/unit/utils')

describe('claim create', () => {
  it('should set the action to wbcreateclaim', done => {
    createClaim({
      id,
      property: 'P5',
      value: 'someid'
    }, properties)
    .action.should.equal('wbcreateclaim')
    done()
  })

  it('should return formatted data for an external id', done => {
    createClaim({
      id,
      property: 'P5',
      value: 'someid'
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P5',
      snaktype: 'value',
      value: '"someid"'
    })
    done()
  })

  it('should return formatted data for a wikibase item', done => {
    createClaim({
      id,
      property: 'P2',
      value: 'Q627323'
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P2',
      snaktype: 'value',
      value: '{"entity-type":"item","numeric-id":627323}'
    })
    done()
  })

  it('should return formatted data for a year', done => {
    createClaim({
      id,
      property: 'P4',
      value: '1802'
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P4',
      snaktype: 'value',
      value: '{"time":"+1802-00-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":9,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should return formatted data for a month', done => {
    createClaim({
      id,
      property: 'P4',
      value: '1802-02'
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P4',
      snaktype: 'value',
      value: '{"time":"+1802-02-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":10,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should return formatted data for a day', done => {
    createClaim({
      id,
      property: 'P4',
      value: '1802-02-03'
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P4',
      snaktype: 'value',
      value: '{"time":"+1802-02-03T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should create a time claim with a low precision', done => {
    createClaim({
      id,
      property: 'P4',
      value: { time: '2500000', precision: 4 }
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P4',
      snaktype: 'value',
      value: '{"time":"+2500000-00-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":4,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  // Not implemented by the Wikibase API
  // it('should create a time claim with a high precision', done => {
  //   createClaim({
  //     id,
  //     property: 'P4',
  //     value: { time: '1802-02-04T11:22:33Z', precision: 14 }
  //   }, properties)
  //   .data.should.deepEqual({
  //     entity: id,
  //     property: 'P4',
  //     snaktype: 'value',
  //     value: '{"time":"+1802-02-04T11:22:33Z","timezone":0,"before":0,"after":0,"precision":14,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
  //   })
  //   done()
  // })

  it('should reject a claim with an invalid time', done => {
    const params = { id, property: 'P4', value: '1802-22-33' }
    createClaim.bind(null, params, properties).should.throw('invalid time value')
    done()
  })

  it('should reject a claim with an invalid time (2)', done => {
    const params = { id, property: 'P4', value: '1802-02-04T11' }
    createClaim.bind(null, params, properties).should.throw('invalid time value')
    done()
  })

  it('should return formatted data for monolingualtext', done => {
    createClaim({
      id,
      property: 'P9',
      value: { text: 'bulgroz', language: 'fr' }
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P9',
      snaktype: 'value',
      value: '{"text":"bulgroz","language":"fr"}'
    })
    done()
  })

  it('should return formatted data for a quantity', done => {
    createClaim({
      id,
      property: 'P8',
      value: 9000
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P8',
      snaktype: 'value',
      value: '{"amount":"+9000","unit":"1"}'
    })
    done()
  })

  it('should return formatted data for a quantity passed as a string', done => {
    createClaim({
      id,
      property: 'P8',
      value: '9001'
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P8',
      snaktype: 'value',
      value: '{"amount":"+9001","unit":"1"}'
    })
    done()
  })

  it('should return formatted data for a quantity with an item-defined unit', done => {
    createClaim({
      id,
      property: 'P8',
      value: { amount: 9001, unit: 'Q7727' }
    }, properties, instance)
    .data.should.deepEqual({
      entity: id,
      property: 'P8',
      snaktype: 'value',
      value: `{"amount":"+9001","unit":"${instance}/entity/Q7727"}`
    })
    done()
  })

  it('should return formatted data for a negative amount', done => {
    createClaim({
      id,
      property: 'P8',
      value: -9002
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P8',
      snaktype: 'value',
      value: '{"amount":"-9002","unit":"1"}'
    })
    done()
  })

  it('should throw when passed an invalid string number', done => {
    const params = { id, property: 'P8', value: '900$1' }
    createClaim.bind(null, params, properties).should.throw('invalid string number')
    done()
  })

  it('should return formatted data for a Url', done => {
    createClaim({
      id,
      property: 'P7',
      value: 'http://foo.bar'
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P7',
      snaktype: 'value',
      value: '"http://foo.bar"'
    })
    done()
  })

  it('should return formatted data for a globe coordinate', done => {
    createClaim({
      id,
      property: 'P6',
      value: { latitude: 45.758, longitude: 4.84138, precision: 1 / 360 }
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P6',
      snaktype: 'value',
      value: '{"latitude":45.758,"longitude":4.84138,"precision":0.002777777777777778}'
    })
    done()
  })

  it('should create a claim of snaktype novalue', done => {
    createClaim({
      id,
      property: 'P8',
      value: { snaktype: 'novalue' }
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P8',
      snaktype: 'novalue'
    })
    done()
  })

  it('should create a claim of snaktype somevalue', done => {
    createClaim({
      id,
      property: 'P8',
      value: { snaktype: 'somevalue' }
    }, properties)
    .data.should.deepEqual({
      entity: id,
      property: 'P8',
      snaktype: 'somevalue'
    })
    done()
  })
})
