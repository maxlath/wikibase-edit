require('should')
const { __ } = require('config')
const getTimeObject = __.require('lib/claim/get_time_object')

describe('claim time', () => {
  it('should parse year without precision', function (done) {
    getTimeObject('2018').should.deepEqual({
      'time': '+2018-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 9,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('-2018').should.deepEqual({
      'time': '-2018-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 9,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse month without precision', function (done) {
    getTimeObject('2018-03').should.deepEqual({
      'time': '+2018-03-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 10,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('-2018-03').should.deepEqual({
      'time': '-2018-03-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 10,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse day without precision', function (done) {
    getTimeObject('2018-03-03').should.deepEqual({
      'time': '+2018-03-03T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 11,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('-2018-03-03').should.deepEqual({
      'time': '-2018-03-03T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 11,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse year with precision', function (done) {
    getTimeObject({ time: '2018', precision: 9 }).should.deepEqual({
      'time': '+2018-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 9,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018', precision: 9 }).should.deepEqual({
      'time': '-2018-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 9,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse month with precision', function (done) {
    getTimeObject({ time: '2018-03', precision: 10 }).should.deepEqual({
      'time': '+2018-03-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 10,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03', precision: 10 }).should.deepEqual({
      'time': '-2018-03-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 10,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse day with precision', function (done) {
    getTimeObject({ time: '2018-03-03', precision: 11 }).should.deepEqual({
      'time': '+2018-03-03T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 11,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03-03', precision: 11 }).should.deepEqual({
      'time': '-2018-03-03T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 11,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse hour with precision', function (done) {
    getTimeObject({ time: '2018-03-03T11:00:00Z', precision: 12 }).should.deepEqual({
      'time': '+2018-03-03T11:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 12,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03-03T11:00:00Z', precision: 12 }).should.deepEqual({
      'time': '-2018-03-03T11:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 12,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse minute with precision', function (done) {
    getTimeObject({ time: '2018-03-03T11:22:00Z', precision: 13 }).should.deepEqual({
      'time': '+2018-03-03T11:22:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 13,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03-03T11:22:00Z', precision: 13 }).should.deepEqual({
      'time': '-2018-03-03T11:22:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 13,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse second with precision', function (done) {
    getTimeObject({ time: '2018-03-03T11:22:33Z', precision: 14 }).should.deepEqual({
      'time': '+2018-03-03T11:22:33Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 14,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03-03T11:22:33Z', precision: 14 }).should.deepEqual({
      'time': '-2018-03-03T11:22:33Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 14,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse decade with precision', function (done) {
    getTimeObject({ time: '2010', precision: 8 }).should.deepEqual({
      'time': '+2010-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 8,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2010', precision: 8 }).should.deepEqual({
      'time': '-2010-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 8,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse century with precision', function (done) {
    getTimeObject({ time: '2100', precision: 7 }).should.deepEqual({
      'time': '+2100-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 7,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2100', precision: 7 }).should.deepEqual({
      'time': '-2100-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 7,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse millenium with precision', function (done) {
    getTimeObject({ time: '2000', precision: 6 }).should.deepEqual({
      'time': '+2000-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 6,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse ten thousand years with precision', function (done) {
    getTimeObject({ time: '-10000', precision: 5 }).should.deepEqual({
      'time': '-10000-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 5,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse ten thousand years without precision and assume its years', function (done) {
    getTimeObject('-10000').should.deepEqual({
      'time': '-10000-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 9,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('10000').should.deepEqual({
      'time': '+10000-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 9,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse hundred thousand years with precision', function (done) {
    getTimeObject({ time: '-2500000', precision: 4 }).should.deepEqual({
      'time': '-2500000-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 4,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse million years with precision', function (done) {
    getTimeObject({ time: '-13798000000', precision: 3 }).should.deepEqual({
      'time': '-13798000000-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 3,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse billion years with precision', function (done) {
    getTimeObject({ time: '-5000000000', precision: 0 }).should.deepEqual({
      'time': '-5000000000-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 0,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })

  it('should parse low precision time with too much precision', function (done) {
    getTimeObject({ time: '2100-01-23', precision: 7 }).should.deepEqual({
      'time': '+2100-00-00T00:00:00Z',
      'timezone': 0,
      'before': 0,
      'after': 0,
      'precision': 7,
      'calendarmodel': 'http://www.wikidata.org/entity/Q1985727'
    })
    done()
  })
})
