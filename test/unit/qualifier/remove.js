require('should')
const { __ } = require('config')
const removeQualifier = __.require('lib/qualifier/remove')
const { guid, hash } = __.require('test/unit/utils')

describe('qualifier remove', () => {
  it('should set the action to wbremoveclaims', done => {
    removeQualifier({ guid, hash }).action.should.equal('wbremovequalifiers')
    done()
  })

  it('should return formatted data for one qualifier', done => {
    removeQualifier({ guid, hash }).data.should.deepEqual({
      claim: guid,
      qualifiers: hash
    })
    done()
  })

  it('should return formatted data for several qualifiers', done => {
    removeQualifier({ guid, hash: [ hash, hash ] }).data.should.deepEqual({
      claim: guid,
      qualifiers: `${hash}|${hash}`
    })
    done()
  })
})
