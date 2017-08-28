const should = require('should')
const CONFIG = require('config')
const _exists = require('../../lib/claim/exists')
const exists = _exists(CONFIG)
const add = require('../../lib/claim/add')(CONFIG)
const remove = require('../../lib/claim/remove')(CONFIG)
const { sandboxEntity } = require('../../lib/tests_utils')
const property = 'P2002'
const value = 'Zorg'
const wdk = require('wikidata-sdk')

describe('claim exists', () => {
  it('should be a function', done => {
    _exists.should.be.a.Function()
    exists.should.be.a.Function()
    done()
  })

  it('should rejected if not passed an entity', function (done) {
    exists(null, 'P50', 'Q535')
    .catch(err => {
      err.message.should.equal('invalid entity')
      done()
    })
  })

  it('should rejected if not passed a property', done => {
    exists(sandboxEntity, null, 'Q535')
    .catch(err => {
      err.message.should.equal('invalid property')
      done()
    })
  })

  it('should rejected if not passed a value', done => {
    exists(sandboxEntity, property)
    .catch(err => {
      err.message.should.equal('missing claim value')
      done()
    })
  })

  // Using an non arrow function to customize the timeout
  // cf https://github.com/mochajs/mocha/issues/2018
  it('should return an array of claim GUIDs if exists', function (done) {
    this.timeout(20 * 1000)
    exists(sandboxEntity, property, value)
    .then(matchingClaimsGuids => {
      if (!matchingClaimsGuids) return add(sandboxEntity, property, value)
    })
    .then(() => {
      exists(sandboxEntity, property, value)
      .then(matchingClaimsGuids => {
        matchingClaimsGuids.should.be.an.Array()
        matchingClaimsGuids[0].should.be.an.String()
        should(wdk.isItemId(matchingClaimsGuids[0].split('$')[0])).be.true()
        done()
      })
    })
    .catch(done)
  })
  it('should return null if there is no claim', function (done) {
    this.timeout(20 * 1000)
    exists(sandboxEntity, property, value)
    .then(matchingClaimsGuids => {
      if (matchingClaimsGuids) return remove(matchingClaimsGuids)
    })
    .then(() => {
      exists(sandboxEntity, property, value)
      .then(matchingClaimsGuids => {
        should(matchingClaimsGuids).not.be.ok()
        done()
      })
    })
    .catch(done)
  })
})
