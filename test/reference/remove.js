require('should')
const addReference = require('../../lib/reference/add')
const removeReference = require('../../lib/reference/remove')
const { guid, hash } = require('../utils')

describe('reference remove', () => {
  it('should set the action to wbremovereferences', done => {
    removeReference({ guid, hash }).action.should.equal('wbremovereferences')
    done()
  })

  it('should return formatted data for one reference', done => {
    removeReference({ guid, hash }).data.should.deepEqual({
      statement: guid,
      references: hash
    })
    done()
  })

  it('should return formatted data for several references', done => {
    removeReference({ guid, hash: [ hash, hash ] }).data.should.deepEqual({
      statement: guid,
      references: `${hash}|${hash}`
    })
    done()
  })
})
