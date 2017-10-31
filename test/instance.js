const should = require('should')
const instance = require('../lib/instance')
const wdk = require('wikidata-sdk')

describe('instance', () => {
  describe('base', () => {
    it('should be a string', done => {
      instance().base.should.be.a.String()
      done()
    })
    it('should be customized if a custom wikibaseInstance is passed', done => {
      const config = { wikibaseInstance: 'https://hello.bla/w/api.php' }
      instance(config).base.should.equal('https://hello.bla/w/api.php')
      done()
    })
  })
  describe('customize', () => {
    it('should be a function', done => {
      instance().customize.should.be.a.Function()
      done()
    })
    it('should replace the instance when passed a custom wikibaseInstance', done => {
      var url = wdk.getEntities({ ids: 'Q1174485' })
      const customInstance = 'https://bla.bla'
      url = instance({ wikibaseInstance: customInstance }).customize(url)
      should(url.startsWith(customInstance)).be.true()
      done()
    })
    it("shouldn't replace the instance if no custom wikibaseInstance is passed", done => {
      var url = wdk.getEntities({ ids: 'Q1174485' })
      url = instance().customize(url)
      should(url.startsWith('https://www.wikidata.org')).be.true()
      done()
    })
  })
})
