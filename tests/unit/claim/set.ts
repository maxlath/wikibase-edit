import 'should'
import setClaim from '#lib/claim/set'
import { guid, sandboxStringProp as property, properties } from '#tests/unit/utils'

describe('claim set', () => {
  it('should set the action to wbsetclaim', () => {
    const { action } = setClaim({
      guid,
      property,
      value: 'foo',
    }, properties)
    action.should.equal('wbsetclaim')
  })

  it('should return formatted claim data for a string', () => {
    const { data } = setClaim({
      guid,
      property,
      value: 'foo',
    }, properties)
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
