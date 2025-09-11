import 'should'
import config from 'config'
import { simplify } from 'wikibase-sdk'
import { getSandboxPropertyId, getReservedItemId } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { shouldNotBeCalled } from '../utils/utils.js'
import WBEdit from '#root'

const wbEdit = WBEdit(config)

describe('reconciliation: general', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should reject a reconciliation object with a typo', async () => {
    const [ id, property ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
    ])
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
