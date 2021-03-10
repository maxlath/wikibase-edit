require('should')

const removeQualifier = require('lib/qualifier/remove')
const { guid, hash } = require('test/unit/utils')

describe('qualifier remove', () => {
  it('should set the action to wbremoveclaims', () => {
    removeQualifier({ guid, hash }).action.should.equal('wbremovequalifiers')
  })

  it('should return formatted data for one qualifier', () => {
    removeQualifier({ guid, hash }).data.should.deepEqual({
      claim: guid,
      qualifiers: hash
    })
  })

  it('should return formatted data for several qualifiers', () => {
    removeQualifier({ guid, hash: [ hash, hash ] }).data.should.deepEqual({
      claim: guid,
      qualifiers: `${hash}|${hash}`
    })
  })
})
