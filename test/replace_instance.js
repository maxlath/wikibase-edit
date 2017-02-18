const test = require('ava')
const replaceInstance = require('../lib/replace_instance.js')
const wdk = require('wikidata-sdk')

test('replace instance should be a function', t => {
  t.true(typeof replaceInstance === 'function')
})

test('replace instance should replace the instance when passed a custom wikibaseInstance', t => {
  var url = wdk.getEntities({ ids: 'Q1174485' })
  const customInstance = 'https://bla.bla'
  url = replaceInstance({ wikibaseInstance: customInstance })(url)
  t.true(url.startsWith(customInstance))
})

test("replace instance shouldn't replace the instance if no custom wikibaseInstance is passed", t => {
  var url = wdk.getEntities({ ids: 'Q1174485' })
  url = replaceInstance()(url)
  t.true(url.startsWith('https://www.wikidata.org'))
})
