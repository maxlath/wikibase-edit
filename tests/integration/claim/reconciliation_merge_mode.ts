import 'should'
import config from 'config'
import { simplify } from 'wikibase-sdk'
import { getSandboxPropertyId, getReservedItemId } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)

describe('reconciliation: merge mode', function () {
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
        mode: 'merge',
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
        mode: 'merge',
      },
    })
    res2.claim.id.should.equal(res.claim.id)
    res2.claim.mainsnak.datavalue.value.should.equal('foo')
  })

  it('should not re-add an existing wikibase-item statement', async () => {
    const [ id, value, qualifierValue, property ] = await Promise.all([
      getReservedItemId(),
      getReservedItemId(),
      getReservedItemId(),
      getSandboxPropertyId('wikibase-item'),
    ])
    const res = await wbEdit.claim.create({ id, property, value })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value,
      qualifiers: { [property]: qualifierValue },
      reconciliation: {
        mode: 'merge',
      },
    })
    res2.claim.id.should.equal(res.claim.id)
    res2.claim.mainsnak.datavalue.value.id.should.equal(value)
    res2.claim.qualifiers[property][0].datavalue.value.id.should.equal(qualifierValue)
  })

  it('should not re-add an existing monolingual text statement', async () => {
    const [ id, property ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('monolingualtext'),
    ])
    const value = { text: randomString(), language: 'fr' }
    const qualifierValue = { text: randomString(), language: 'de' }
    const res = await wbEdit.claim.create({ id, property, value })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value,
      qualifiers: { [property]: qualifierValue },
      reconciliation: {
        mode: 'merge',
      },
    })
    res2.claim.id.should.equal(res.claim.id)
    res2.claim.mainsnak.datavalue.value.text.should.equal(value.text)
    res2.claim.mainsnak.datavalue.value.language.should.equal(value.language)
    res2.claim.qualifiers[property][0].datavalue.value.text.should.equal(qualifierValue.text)
    res2.claim.qualifiers[property][0].datavalue.value.language.should.equal(qualifierValue.language)
  })

  it('should re-add a statement if expected qualifiers do not match', async () => {
    const [ id, property ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
    ])
    const res = await wbEdit.claim.create({ id, property, value: 'foo', qualifiers: { [property]: 'bar' } })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      qualifiers: { [property]: 'buzz' },
      reconciliation: {
        mode: 'merge',
        matchingQualifiers: [ property ],
      },
    })
    res2.claim.id.should.not.equal(res.claim.id)
  })

  it('should merge qualifiers', async () => {
    const [ id, property, property2 ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
      getSandboxPropertyId('quantity'),
    ])
    const res = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      qualifiers: {
        [property]: 'bar',
        [property2]: 123,
      },
    })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      qualifiers: {
        [property]: 'buzz',
        [property2]: 123,
      },
      reconciliation: { mode: 'merge' },
    })
    res2.claim.id.should.equal(res.claim.id)
    res2.claim.qualifiers[property].map(simplify.qualifier).should.deepEqual([ 'bar', 'buzz' ])
    res2.claim.qualifiers[property2].map(simplify.qualifier).should.deepEqual([ 123 ])
  })

  it('should not add an identical reference', async () => {
    const [ id, property, property2 ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
      getSandboxPropertyId('quantity'),
    ])
    const res = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      references: [
        { [property]: 'bar', [property2]: 123 },
      ],
    })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      references: [
        { [property]: 'bar', [property2]: 123 },
        { [property]: 'bar' },
      ],
      reconciliation: { mode: 'merge' },
    })
    res2.claim.id.should.equal(res.claim.id)
    simplify.references(res2.claim.references).should.deepEqual([
      { [property2]: [ 123 ], [property]: [ 'bar' ] },
      { [property]: [ 'bar' ] },
    ])
  })

  it('should merge matching references', async () => {
    const [ id, property, property2, property3 ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
      getSandboxPropertyId('quantity'),
      getSandboxPropertyId('wikibase-item'),
    ])
    await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      references: [
        { [property]: 'bar' },
        { [property2]: 456 },
      ],
    })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      references: [
        { [property]: 'bar', [property2]: 123 },
        { [property2]: 456, [property3]: id },
      ],
      reconciliation: {
        mode: 'merge',
        matchingReferences: [ property ],
      },
    })
    simplify.references(res2.claim.references).should.deepEqual([
      { [property2]: [ 123 ], [property]: [ 'bar' ] },
      { [property2]: [ 456 ] },
      { [property2]: [ 456 ], [property3]: [ id ] },
    ])
  })

  it('should add a different reference', async () => {
    const [ id, property, property2 ] = await Promise.all([
      getReservedItemId(),
      getSandboxPropertyId('string'),
      getSandboxPropertyId('quantity'),
    ])
    const res = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      references: {
        [property]: 'bar',
        [property2]: 123,
      },
    })
    const res2 = await wbEdit.claim.create({
      id,
      property,
      value: 'foo',
      references: {
        [property]: 'bar',
        [property2]: 124,
      },
      reconciliation: { mode: 'merge' },
    })
    res2.claim.id.should.equal(res.claim.id)
    simplify.references(res2.claim.references).should.deepEqual([
      { [property]: [ 'bar' ], [property2]: [ 123 ] },
      { [property]: [ 'bar' ], [property2]: [ 124 ] },
    ])
  })
})
