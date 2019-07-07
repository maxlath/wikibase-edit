require('should')
const { log, Log, LogError } = require('../lib/log')({ verbose: true })

describe('loggers', () => {
  describe('log', () => {
    it('should return what it logs', done => {
      log('bla', 123).should.equal(123)
      done()
    })
  })

  describe('Log', () => {
    it('should return what it logs', done => {
      Log('bla')(123).should.equal(123)
      done()
    })
  })

  describe('LogError', () => {
    it('should return what it logs', done => {
      const err = new Error('doh')
      const fn = () => LogError('bla')(err)
      fn.should.throw()
      done()
    })
  })
})
