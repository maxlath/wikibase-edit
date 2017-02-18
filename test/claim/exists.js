const test = require('ava')
const exists = require('../../lib/claim/exists')
const entity = 'Q4115189'
const property = 'P2002'
const value = 'Zorg'

test('check claim existance should be a function', t => {
  t.true(typeof exists === 'function')
  t.true(typeof exists() === 'function')
})

test('add claim should rejected if not passed an entity', t => {
  t.plan(1)
  return exists()()
  .catch(err => t.is(err.message, 'invalid entity'))
})

test('add claim should rejected if not passed an property', t => {
  t.plan(1)
  return exists()(entity)
  .catch(err => t.is(err.message, 'invalid property'))
})

test('add claim should rejected if not passed a value', t => {
  t.plan(1)
  return exists()(entity, property)
  .catch(err => t.is(err.message, 'missing value'))
})

test('check claim existance should return a boolean', t => {
  t.plan(1)

  return exists()(entity, property, value)
  .then(res => {
    t.true(typeof res === 'boolean')
  })
})
