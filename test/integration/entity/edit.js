require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { simplify } = require('wikibase-sdk')
const { randomString } = __.require('test/unit/utils')
const { getSandboxItemId, getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')

describe('entity edit', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should edit an item', async () => {
    const label = randomString()
    const id = await getSandboxItemId()
    const res = await wbEdit.entity.edit({
      id,
      labels: { nl: label }
    })
    res.entity.labels.nl.value.should.equal(label)
  })

  it('should clear and edit an item', async () => {
    const [ pidA, pidB, pidC ] = await Promise.all([
      getSandboxPropertyId('string'),
      getSandboxPropertyId('external-id'),
      getSandboxPropertyId('url')
    ])
    const claims = {}
    claims[pidA] = { value: randomString(), qualifiers: {}, references: {} }
    claims[pidA].qualifiers[pidB] = randomString()
    claims[pidA].references[pidC] = 'http://foo.bar'
    const params = {
      labels: { en: randomString() },
      description: { en: randomString() },
      aliases: { en: randomString() },
      claims
    }
    const resA = await wbEdit.entity.create(params)
    const newLabel = randomString()
    const resB = await wbEdit.entity.edit({
      id: resA.entity.id,
      clear: true,
      labels: {
        en: newLabel
      }
    })
    resB.success.should.equal(1)
    const { entity } = resB
    entity.labels.should.deepEqual({ en: { language: 'en', value: newLabel } })
    entity.descriptions.should.deepEqual({})
    entity.aliases.should.deepEqual({})
    entity.claims.should.deepEqual({})
  })

  it('should set an item claim rank', async () => {
    const [ id, propertyId ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('string')
    ])
    const claims = {}
    claims[propertyId] = [
      { rank: 'preferred', value: 'foo' },
      { rank: 'normal', value: 'bar' },
      { rank: 'deprecated', value: 'buzz' }
    ]
    const res = await wbEdit.entity.edit({ id, claims })
    const propertyClaims = res.entity.claims[propertyId].slice(-3)
    const simplifiedPropertyClaims = simplify.propertyClaims(propertyClaims, { keepRanks: true, keepNonTruthy: true })
    simplifiedPropertyClaims.should.deepEqual(claims[propertyId])
  })
})
