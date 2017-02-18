const test = require('ava')
const wdEdit = require('..')
const config = {
  username: 'bla',
  password: 'bla'
}

test('wikidata-edit should be a function', t => {
  t.true(typeof wdEdit === 'function')
})

test('wikidata-edit should throw if not passed a username', t => {
  t.throws(() => wdEdit({ password: 'bla' }))
})

test('wikidata-edit should throw if not passed a password', t => {
  t.throws(() => wdEdit({ username: 'bla' }))
})

test('wikidata-edit should return an object', t => {
  t.true(typeof wdEdit(config) === 'object')
})

test('wikidata-edit object should have claim functions', t => {
  t.true(typeof wdEdit(config).claim === 'object')
  t.true(typeof wdEdit(config).claim.checkExistance === 'function')
})
