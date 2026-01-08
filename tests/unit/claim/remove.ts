import 'should'
import { removeClaim } from '../../../src/lib/claim/remove.js'
import { guid, guid2 } from '../utils.js'

describe('claim remove', () => {
  it('should set the action to wbremoveclaims', async () => {
    // @ts-expect-error
    const { action } = await removeClaim({ guid })
    action.should.equal('wbremoveclaims')
  })

  it('should return formatted data for one claim', async () => {
    // @ts-expect-error
    const { data } = await removeClaim({ guid })
    data.claim.should.equal(guid)
  })

  it('should return formatted data for several claims', async () => {
    const guids = [ guid, guid2 ]
    // @ts-expect-error
    const { data } = await removeClaim({ guid: guids })
    data.claim.should.equal(guids.join('|'))
  })
})
