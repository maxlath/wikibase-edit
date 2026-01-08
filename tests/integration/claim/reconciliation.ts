import 'should'
import config from 'config'
import { simplify } from 'wikibase-sdk'
import WBEdit from '../../../src/lib/index.js'
import { getSandboxPropertyId, getReservedItemId } from '../utils/sandbox_entities.js'
import { shouldNotBeCalled } from '../utils/utils.js'
import { waitForInstance } from '../utils/wait_for_instance.js'

const wbEdit = WBEdit(config)

describe('reconciliation: general', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should reject a reconciliation object with a typo', async () => {
    const [ id, property ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
    ])
    // @ts-expect-error
    await wbEdit.claim.create({ id, property, value: 'foo', reconciliationz: {} })
    .then(shouldNotBeCalled)
    .catch(err => {
      err.message.should.equal('invalid parameter: reconciliationz')
    })

    await wbEdit.entity.edit({
      id,
      claims: {
        [property]: 'foo',
      },
      // @ts-expect-error
      reconciliationz: {},
    })
    .then(shouldNotBeCalled)
    .catch(err => {
      err.message.should.equal('invalid parameter: reconciliationz')
    })

    await wbEdit.entity.edit({
      id,
      claims: {
        [property]: {
          value: 'foo',
          // @ts-expect-error
          reconciliationz: {},
        },
      },
    })
    .then(shouldNotBeCalled)
    .catch(err => {
      err.message.should.equal('invalid claim parameter: reconciliationz')
    })
  })

  describe('per-claim reconciliation settings', () => {
    it('should accept per-claim reconciliation settings', async () => {
      const [ id, property ] = await Promise.all([
        getReservedItemId(),
        getSandboxPropertyId('string'),
      ])
      await wbEdit.entity.edit({
        id,
        claims: {
          [property]: [
            { value: 'foo', qualifiers: { [property]: 'buzz' } },
            { value: 'bar', qualifiers: { [property]: 'bla' } },
          ],
        },
      })
      const res2 = await wbEdit.entity.edit({
        id,
        claims: {
          [property]: [
            { value: 'foo', qualifiers: { [property]: 'blo' } },
            { value: 'bar', qualifiers: { [property]: 'bli' }, reconciliation: { mode: 'skip-on-value-match' } },
          ],
        },
        reconciliation: {
          mode: 'merge',
        },
      })
      simplify.claims(res2.entity.claims, { keepQualifiers: true }).should.deepEqual({
        [property]: [
          { value: 'foo', qualifiers: { [property]: [ 'buzz', 'blo' ] } },
          { value: 'bar', qualifiers: { [property]: [ 'bla' ] } },
        ],
      })
    })
  })
})
