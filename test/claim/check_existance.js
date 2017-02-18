const test = require('ava')
const checkExistance = require('../../lib/claim/check_existance.js')
const entity = 'Q4115189'
const property = 'P2002'
const value = 'Zorg'

test('check claim existance should be a function', t => {
  t.true(typeof checkExistance === 'function')
  t.true(typeof checkExistance() === 'function')
})

test('add claim should rejected if not passed an entity', t => {
  t.plan(1)
  return checkExistance()()
  .catch(err => t.is(err.message, 'invalid entity'))
})

test('add claim should rejected if not passed an property', t => {
  t.plan(1)
  return checkExistance()(entity)
  .catch(err => t.is(err.message, 'invalid property'))
})

test('add claim should rejected if not passed a value', t => {
  t.plan(1)
  return checkExistance()(entity, property)
  .catch(err => t.is(err.message, 'missing value'))
})

test('check claim existance should return a boolean', t => {
  t.plan(1)

  return checkExistance()(entity, property, value)
  .then(res => {
    console.log('res', res)
    t.true(typeof res === 'boolean')
  })
})
