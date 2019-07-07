require('should')
const removeClaim = require('../../lib/claim/remove')
const { getClaimGuid, guid, guid2 } = require('../utils')

describe('claim remove', () => {
  it('should set the action to wbremoveclaims', done => {
    removeClaim({ guid }).action.should.equal('wbremoveclaims')
    done()
  })

  it('should return formatted data for one claim', done => {
    removeClaim({ guid }).data.claim.should.equal(guid)
    done()
  })

  it('should return formatted data for several claims', done => {
    const guids = [ guid, guid2 ]
    removeClaim({ guid: guids }).data.claim.should.equal(guids.join('|'))
    done()
  })
})
