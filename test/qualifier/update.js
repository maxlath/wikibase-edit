require('should')
const CONFIG = require('config')
const addQualifier = require('../../lib/qualifier/add')(CONFIG)
const updateQualifier = require('../../lib/qualifier/update')(CONFIG)
const { getClaimGuid } = require('../../lib/tests_utils')
const wdk = require('wikidata-sdk')

var claimGuidPromise

describe('reference update', () => {
  before(function (done) {
    claimGuidPromise = getClaimGuid()
    done()
  })

  it('should be a function', done => {
    updateQualifier.should.be.a.Function()
    done()
  })

  it('should update a claim', function (done) {
    this.timeout(20 * 1000)
    claimGuidPromise
    .then(guid => {
      const property = 'P156'
      return addQualifier(guid, property, 'Q4115189')
      .then(res => updateQualifier(guid, property, 'Q4115189', 'Q4115190'))
      .then(res => {
        res.success.should.equal(1)
        wdk.simplifyClaim(res.claim.qualifiers[property][0]).should.equal('Q4115190')
        done()
      })
    })
    .catch(done)
  })
})
