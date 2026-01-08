import 'should'
import { setClaim } from '../../../src/lib/claim/set.js'
import { guid, sandboxStringProp as property, properties, someInstance } from '../utils.js'

describe('claim set', () => {
  it('should set the action to wbsetclaim', () => {
    const { action } = setClaim({
      guid,
      property,
      value: 'foo',
    }, properties, someInstance)
    action.should.equal('wbsetclaim')
  })

  it('should return formatted claim data for a string', () => {
    const { data } = setClaim({
      guid,
      property,
      value: 'foo',
    }, properties, someInstance)
    JSON.parse(data.claim).should.deepEqual({
      id: guid,
      type: 'statement',
      mainsnak: {
        snaktype: 'value',
        property,
        datavalue: {
          value: 'foo',
          type: 'string',
        },
      },
    })
  })
})
