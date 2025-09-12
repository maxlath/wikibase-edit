import 'should'
import { setReference } from '#lib/reference/set'
import { guid, properties, hash, someInstance } from '#tests/unit/utils'
import type { SpecialSnak } from '../../../src/lib/claim/special_snaktype'
import type { PropertyId } from 'wikibase-sdk'

describe('reference set', () => {
  it('should rejected if not passed a claim guid', () => {
    // @ts-expect-error
    setReference.bind(null, {}, properties).should.throw('missing guid')
  })

  it('should rejected if passed an invalid claim guid', () => {
    // @ts-expect-error
    setReference.bind(null, { guid: 'some-invalid-guid' }, properties)
    .should.throw('invalid guid')
  })

  it('should rejected if not passed a property id', () => {
    setReference.bind(null, { guid }, properties).should.throw('missing property id')
  })

  it('should rejected if not passed a reference value', () => {
    setReference.bind(null, { guid, property: 'P2' }, properties)
    .should.throw('missing snak value')
  })

  it('should rejected if passed an invalid reference', () => {
    const params = { guid, property: 'P2', value: 'not-a-valid-reference' }
    // @ts-expect-error
    setReference.bind(null, params, properties).should.throw('invalid entity value')
  })

  it('should set the action to wbsetreference', () => {
    const params = { guid, property: 'P2' as PropertyId, value: 'Q1' }
    setReference(params, properties, someInstance).action.should.equal('wbsetreference')
  })

  it('should format the data for a url', () => {
    const params = { guid, property: 'P7' as PropertyId, value: 'http://foo.bar' }
    setReference(params, properties, someInstance).data.should.deepEqual({
      statement: guid,
      snaks: '{"P7":[{"property":"P7","snaktype":"value","datavalue":{"type":"string","value":"http://foo.bar"}}]}',
    })
  })

  it('should set a reference with a special snaktype', () => {
    const params = { guid, property: 'P7' as PropertyId, value: { snaktype: 'somevalue' } }
    setReference(params, properties, someInstance).data.should.deepEqual({
      statement: guid,
      snaks: '{"P7":[{"snaktype":"somevalue","property":"P7"}]}',
    })
  })

  it('should accept snaks', () => {
    const snaks = {
      P2: 'Q1',
      P7: [
        'http://foo.bar',
        { snaktype: 'somevalue' } as SpecialSnak,
      ],
    }
    const params = { guid, snaks }
    setReference(params, properties, someInstance).data.should.deepEqual({
      statement: guid,
      snaks: '[{"property":"P2","snaktype":"value","datavalue":{"type":"wikibase-entityid","value":{"id":"Q1","entity-type":"item"}}},{"property":"P7","snaktype":"value","datavalue":{"type":"string","value":"http://foo.bar"}},{"snaktype":"somevalue","property":"P7"}]',
    })
  })

  it('should accept a hash', () => {
    const params = { guid, property: 'P2' as PropertyId, value: 'Q1', hash }
    setReference(params, properties, someInstance).data.reference.should.equal(hash)
  })
})
