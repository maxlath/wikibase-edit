const test = require('ava')
const CONFIG = require('config')
const addClaim = require('../../lib/claim/add')
const randomString = () => Math.random().toString(36).slice(2, 10)
const entity = 'Q4115189'
const property = 'P2002'

test('add claim should be a function', t => {
  t.true(typeof addClaim === 'function')
  t.true(typeof addClaim(CONFIG) === 'function')
})

test('add claim should add a claim', t => {
  const value = randomString()
  t.plan(1)
  return addClaim(CONFIG)(entity, property, value)
  .then(res => t.is(res.success, 1))
})

test('add claim should add a claim with a reference if provided', t => {
  const value = randomString()
  t.plan(1)
  return addClaim(CONFIG)(entity, property, value, 'Q60856')
  .then(res => t.is(res.success, 1))
})
