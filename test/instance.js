const test = require('ava')
const instance = require('../lib/instance')
const wdk = require('wikidata-sdk')

test('customize instance should be a function', t => {
  t.true(typeof instance().customize === 'function')
})

test('customize instance should replace the instance when passed a custom wikibaseInstance', t => {
  var url = wdk.getEntities({ ids: 'Q1174485' })
  const customInstance = 'https://bla.bla'
  url = instance({ wikibaseInstance: customInstance }).customize(url)
  t.true(url.startsWith(customInstance))
})

test("customize instance shouldn't replace the instance if no custom wikibaseInstance is passed", t => {
  var url = wdk.getEntities({ ids: 'Q1174485' })
  url = instance().customize(url)
  t.true(url.startsWith('https://www.wikidata.org'))
})

test("instance base should be customized if a custom wikibaseInstance is passed", t => {
  const config = { wikibaseInstance: 'https://hello.bla'}
  t.is(instance(config).base, 'https://hello.bla/w/api.php')
})
