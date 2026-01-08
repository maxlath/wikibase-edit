import 'should'
import { removeReference } from '../../../src/lib/reference/remove.js'
import { guid, hash } from '../utils.js'

describe('reference remove', () => {
  it('should set the action to wbremovereferences', () => {
    removeReference({ guid, hash }).action.should.equal('wbremovereferences')
  })

  it('should return formatted data for one reference', () => {
    removeReference({ guid, hash }).data.should.deepEqual({
      statement: guid,
      references: hash,
    })
  })

  it('should return formatted data for several references', () => {
    removeReference({ guid, hash: [ hash, hash ] }).data.should.deepEqual({
      statement: guid,
      references: `${hash}|${hash}`,
    })
  })
})
