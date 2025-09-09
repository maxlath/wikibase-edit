import config from 'config'
import should from 'should'
import { simplify, type ItemId, type SimplifiedSitelinkWithBadges } from 'wikibase-sdk'
import type { EditEntitySimplifiedModeParams } from '#lib/entity/edit'
import { getProperty } from '#tests/integration/utils/get_property'
import { getSandboxItemId, getSandboxPropertyId, createItem } from '#tests/integration/utils/sandbox_entities'
import { addClaim } from '#tests/integration/utils/sandbox_snaks'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { assert, randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import { getEntity } from '../utils/utils.js'

const wbEdit = WBEdit(config)

describe('entity edit', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should edit an item', async () => {
    const label = randomString()
    const id = await getSandboxItemId()
    const res = await wbEdit.entity.edit({
      id,
      labels: { nl: label },
    })
    assert('labels' in res.entity)
    res.entity.labels.nl.value.should.equal(label)
  })

  it('should clear and edit an item', async () => {
    const [ pidA, pidB, pidC ] = await Promise.all([
      getSandboxPropertyId('string'),
      getSandboxPropertyId('external-id'),
      getSandboxPropertyId('url'),
    ])
    const claims = {}
    claims[pidA] = { value: randomString(), qualifiers: {}, references: {} }
    claims[pidA].qualifiers[pidB] = randomString()
    claims[pidA].references[pidC] = 'http://foo.bar'
    const params = {
      labels: { en: randomString() },
      descriptions: { en: randomString() },
      aliases: { en: randomString() },
      claims,
    }
    const resA = await wbEdit.entity.create(params as EditEntitySimplifiedModeParams)
    const newLabel = randomString()
    const resB = await wbEdit.entity.edit({
      id: resA.entity.id as ItemId,
      clear: true,
      labels: {
        en: newLabel,
      },
    })
    resB.success.should.equal(1)
    const { entity } = resB
    assert('labels' in entity)
    assert('descriptions' in entity)
    assert('aliases' in entity)
    entity.labels.should.deepEqual({ en: { language: 'en', value: newLabel } })
    entity.descriptions.should.deepEqual({})
    entity.aliases.should.deepEqual({})
    entity.claims.should.deepEqual({})
  })

  it('should set an item claim rank', async () => {
    const [ id, propertyId ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('string'),
    ])
    const claims = {}
    claims[propertyId] = [
      { rank: 'preferred', value: 'foo' },
      { rank: 'normal', value: 'bar' },
      { rank: 'deprecated', value: 'buzz' },
    ]
    const res = await wbEdit.entity.edit({ id, claims })
    assert('claims' in res.entity)
    const propertyClaims = res.entity.claims[propertyId].slice(-3)
    const simplifiedPropertyClaims = simplify.propertyClaims(propertyClaims, { keepRanks: true, keepNonTruthy: true })
    simplifiedPropertyClaims.should.deepEqual(claims[propertyId])
  })

  it('should clear language terms by passing null', async () => {
    const resA = await wbEdit.entity.create({
      labels: { en: randomString() },
      descriptions: { en: randomString() },
      aliases: { en: randomString() },
    } as EditEntitySimplifiedModeParams)
    const resB = await wbEdit.entity.edit({
      id: resA.entity.id as ItemId,
      labels: { en: null },
      descriptions: { en: null },
      aliases: { en: null },
    })
    resB.success.should.equal(1)
  })

  it('should add an alias without removing the previous aliases', async () => {
    const aliasA = randomString()
    const aliasB = randomString()
    const { entity } = await wbEdit.entity.create({
      labels: { en: randomString() },
      aliases: { en: aliasA },
    } as EditEntitySimplifiedModeParams)
    const resB = await wbEdit.entity.edit({
      id: entity.id,
      aliases: {
        en: { value: aliasB, add: true },
      },
    } as EditEntitySimplifiedModeParams)
    assert('aliases' in resB.entity)
    simplify.aliases(resB.entity.aliases).en.should.deepEqual([ aliasA, aliasB ])
  })

  // This test requires setting an instance with sitelinks
  // (such as test.wikidata.org) in config, and is thus disabled by default
  xit('should add and remove a sitelink', async () => {
    const id = await getSandboxItemId()
    const yearArticleTitle = Math.trunc(Math.random() * 2020).toString()
    const res = await wbEdit.entity.edit({
      id,
      sitelinks: {
        frwiki: yearArticleTitle,
        dewiki: { title: yearArticleTitle, badges: [ 'Q608', 'Q609' ] } as SimplifiedSitelinkWithBadges,
      },
    } as EditEntitySimplifiedModeParams)
    assert('sitelinks' in res.entity)
    res.entity.sitelinks.frwiki.title.should.equal(yearArticleTitle)
    res.entity.sitelinks.dewiki.title.should.equal(yearArticleTitle)
    const res2 = await wbEdit.entity.edit({
      id,
      // @ts-expect-error
      sitelinks: {
        frwiki: { title: yearArticleTitle, remove: true },
        dewiki: null,
      },
    })
    assert('sitelinks' in res2.entity)
    should(res2.entity.sitelinks.frwiki).not.be.ok()
    should(res2.entity.sitelinks.dewiki).not.be.ok()
  })

  describe('raw mode', () => {
    it('shoud accept raw data', async () => {
      const [ labelA, labelB, claimValueA, claimValueB ] = [ randomString(), randomString(), randomString(), randomString() ]
      const { id } = await createItem({ labels: { en: labelA } })
      const { property } = await addClaim({ id, datatype: 'string', value: claimValueA })
      const { id: otherStringPropertyId } = await getProperty({ datatype: 'string', reserved: true })
      const { labels, claims } = await getEntity(id)
      labels.en.value = labelB
      const claim = claims[property][0]
      const { id: guid } = claim
      delete claim.id
      const removedClaim = { id: guid, remove: true }
      claim.mainsnak.property = otherStringPropertyId
      claim.mainsnak.datavalue.value = claimValueB
      const res = await wbEdit.entity.edit({
        rawMode: true,
        id,
        labels,
        claims: [ removedClaim, claim ],
      })
      assert('labels' in res.entity)
      res.entity.labels.en.value.should.equal(labelB)
      should(res.entity.claims[property]).not.be.ok()
      const { mainsnak } = res.entity.claims[otherStringPropertyId][0]
      assert('datavalue' in mainsnak)
      mainsnak.datavalue.value.should.equal(claimValueB)
    })
  })
})
