require('module-alias/register')
require('should')
const removeClaim = require('lib/claim/remove')
const { guid, guid2 } = require('tests/unit/utils')

describe('claim remove', () => {
  it('should set the action to wbremoveclaims', () => {
    removeClaim({ guid }).action.should.equal('wbremoveclaims')
  })

  it('should return formatted data for one claim', () => {
    removeClaim({ guid }).data.claim.should.equal(guid)
  })

  it('should return formatted data for several claims', () => {
    const guids = [ guid, guid2 ]
    removeClaim({ guid: guids }).data.claim.should.equal(guids.join('|'))
  })
})
