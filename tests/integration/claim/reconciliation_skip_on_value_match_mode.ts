import 'should'
import config from 'config'
import { simplify } from 'wikibase-sdk'
import { getSandboxPropertyId, getReservedItemId } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import WBEdit from '#root'

const wbEdit = WBEdit(config)

describe('reconciliation: skip-on-value-match mode', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should add a statement when no statement exists', async () => {
    const [ id, property ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
    ])
    const res = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      reconciliation: {
        mode: 'skip-on-value-match',
      },
    })
    res.claim.mainsnak.datavalue.value.should.equal('foo')
  })

  it('should not re-add an existing statement', async () => {
    const [ id, property ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
    ])
    const res = await wbEdit.claim.create({ id, property, value: 'foo' })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      reconciliation: {
        mode: 'skip-on-value-match',
      },
    })
    res2.claim.id.should.equal(res.claim.id)
    res2.claim.mainsnak.datavalue.value.should.equal('foo')
  })

  it('should not merge qualifiers and references', async () => {
    const [ id, property ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
    ])
    const res = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      qualifiers: { [property]: 'bar' },
      references: { [property]: 'buzz' },
    })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      qualifiers: { [property]: 'bla' },
      references: { [property]: 'blu' },
      reconciliation: {
        mode: 'skip-on-value-match',
      },
    })
    res2.claim.id.should.equal(res.claim.id)
    res2.claim.mainsnak.datavalue.value.should.equal('foo')
    simplify.propertyQualifiers(res2.claim.qualifiers[property]).should.deepEqual([ 'bar' ])
    simplify.references(res2.claim.references).should.deepEqual([ { [property]: [ 'buzz' ] } ])
  })
})
