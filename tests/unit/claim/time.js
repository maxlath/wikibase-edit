require('module-alias/register')
require('should')

const getTimeObject = require('lib/claim/get_time_object')

describe('claim time', () => {
  it('should parse year without precision', () => {
    getTimeObject('2018').should.deepEqual({
      time: '+2018-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 9,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('-2018').should.deepEqual({
      time: '-2018-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 9,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse month without precision', () => {
    getTimeObject('2018-03').should.deepEqual({
      time: '+2018-03-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('-2018-03').should.deepEqual({
      time: '-2018-03-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse day without precision', () => {
    getTimeObject('2018-03-03').should.deepEqual({
      time: '+2018-03-03T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 11,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('-2018-03-03').should.deepEqual({
      time: '-2018-03-03T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 11,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse year with precision', () => {
    getTimeObject({ time: '2018', precision: 9 }).should.deepEqual({
      time: '+2018-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 9,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018', precision: 9 }).should.deepEqual({
      time: '-2018-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 9,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse month with precision', () => {
    getTimeObject({ time: '2018-03', precision: 10 }).should.deepEqual({
      time: '+2018-03-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03', precision: 10 }).should.deepEqual({
      time: '-2018-03-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse day with precision', () => {
    getTimeObject({ time: '2018-03-03', precision: 11 }).should.deepEqual({
      time: '+2018-03-03T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 11,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03-03', precision: 11 }).should.deepEqual({
      time: '-2018-03-03T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 11,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse hour with precision', () => {
    getTimeObject({ time: '2018-03-03T11:00:00Z', precision: 12 }).should.deepEqual({
      time: '+2018-03-03T11:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 12,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03-03T11:00:00Z', precision: 12 }).should.deepEqual({
      time: '-2018-03-03T11:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 12,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse minute with precision', () => {
    getTimeObject({ time: '2018-03-03T11:22:00Z', precision: 13 }).should.deepEqual({
      time: '+2018-03-03T11:22:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 13,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03-03T11:22:00Z', precision: 13 }).should.deepEqual({
      time: '-2018-03-03T11:22:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 13,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse second with precision', () => {
    getTimeObject({ time: '2018-03-03T11:22:33Z', precision: 14 }).should.deepEqual({
      time: '+2018-03-03T11:22:33Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 14,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2018-03-03T11:22:33Z', precision: 14 }).should.deepEqual({
      time: '-2018-03-03T11:22:33Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 14,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse decade with precision', () => {
    getTimeObject({ time: '2010', precision: 8 }).should.deepEqual({
      time: '+2010-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 8,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2010', precision: 8 }).should.deepEqual({
      time: '-2010-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 8,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse century with precision', () => {
    getTimeObject({ time: '2100', precision: 7 }).should.deepEqual({
      time: '+2100-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 7,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({ time: '-2100', precision: 7 }).should.deepEqual({
      time: '-2100-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 7,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse millenium with precision', () => {
    getTimeObject({ time: '2000', precision: 6 }).should.deepEqual({
      time: '+2000-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 6,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
  })

  it('should parse ten thousand years with precision', () => {
    getTimeObject({ time: '-10000', precision: 5 }).should.deepEqual({
      time: '-10000-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 5,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse ten thousand years without precision and assume its years', () => {
    getTimeObject('-10000').should.deepEqual({
      time: '-10000-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 9,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
    getTimeObject('10000').should.deepEqual({
      time: '+10000-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 9,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
  })

  it('should parse hundred thousand years with precision', () => {
    getTimeObject({ time: '-2500000', precision: 4 }).should.deepEqual({
      time: '-2500000-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 4,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse million years with precision', () => {
    getTimeObject({ time: '-13798000000', precision: 3 }).should.deepEqual({
      time: '-13798000000-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 3,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse billion years with precision', () => {
    getTimeObject({ time: '-5000000000', precision: 0 }).should.deepEqual({
      time: '-5000000000-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 0,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should parse low precision time with too much precision', () => {
    getTimeObject({ time: '2100-01-23', precision: 7 }).should.deepEqual({
      time: '+2100-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 7,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
  })

  it('should set custom calendar', () => {
    const gregorian = 'http://www.wikidata.org/entity/Q1985727'
    const julian = 'http://www.wikidata.org/entity/Q1985786'
    getTimeObject({ time: '2020' }).calendarmodel.should.equal(gregorian)
    getTimeObject({ time: '2020', calendar: 'gregorian' }).calendarmodel.should.equal(gregorian)
    getTimeObject({ time: '2020', calendar: 'Q1985727' }).calendarmodel.should.equal(gregorian)
    getTimeObject({ time: '2020', calendar: gregorian }).calendarmodel.should.equal(gregorian)
    getTimeObject({ time: '2020', calendar: 'julian' }).calendarmodel.should.equal(julian)
    getTimeObject({ time: '2020', calendar: 'Q1985786' }).calendarmodel.should.equal(julian)
    getTimeObject({ time: '2020', calendar: julian }).calendarmodel.should.equal(julian)
  })

  it('should accept full rich value', () => {
    getTimeObject({
      time: '2018-04-15T00:00:00.000Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    }).should.deepEqual({
      time: '+2018-04-15T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
  })

  it('should accept setting month precision for times that specify a day', () => {
    getTimeObject({
      time: '2018-04-15T00:00:00.000Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    }).should.deepEqual({
      time: '+2018-04-15T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
  })

  it('should default to julian calendar for dates before 1582, 1582 included', () => {
    getTimeObject('1582').should.deepEqual({
      time: '+1582-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 9,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
    getTimeObject('1582-11').should.deepEqual({
      time: '+1582-11-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
    getTimeObject('1582-12-04').should.deepEqual({
      time: '+1582-12-04T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 11,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
    getTimeObject({
      time: '+1582-12-04T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    }).should.deepEqual({
      time: '+1582-12-04T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985786'
    })
  })

  it('should default to gregorian calendar for dates after 1582', () => {
    getTimeObject('1583').should.deepEqual({
      time: '+1583-00-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 9,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('1583-02').should.deepEqual({
      time: '+1583-02-00T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject('1583-10-05').should.deepEqual({
      time: '+1583-10-05T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 11,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
    getTimeObject({
      time: '+1583-10-05T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    }).should.deepEqual({
      time: '+1583-10-05T00:00:00Z',
      timezone: 0,
      before: 0,
      after: 0,
      precision: 10,
      calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
    })
  })
})
