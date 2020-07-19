require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const { getSandboxPropertyId, getSandboxItemId } = __.require('test/integration/utils/sandbox_entities')
const { isGuid } = require('wikibase-sdk')

describe('claim create', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should create a claim', async () => {
    const [ qid, pid ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('string')
    ])
    const value = randomString()
    const res = await wbEdit.claim.create({ id: qid, property: pid, value })
    res.success.should.equal(1)
    isGuid(res.claim.id).should.be.true()
    res.claim.rank.should.equal('normal')
    res.claim.mainsnak.snaktype.should.equal('value')
    res.claim.mainsnak.datavalue.value.should.equal(value)
  })

  it('should create a claim with a negative year', async () => {
    const [ qid, pid ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('time')
    ])
    const res = await wbEdit.claim.create({ id: qid, property: pid, value: '-0028' })
    res.success.should.equal(1)
    isGuid(res.claim.id).should.be.true()
    res.claim.rank.should.equal('normal')
    res.claim.mainsnak.snaktype.should.equal('value')
    res.claim.mainsnak.datavalue.value.time.should.equal('-0028-00-00T00:00:00Z')
  })

  // wbcreateclaim currently doesn't take a rank value
  xit('should create a claim with a preferred rank', async () => {
    const [ qid, pid ] = await Promise.all([
      getSandboxItemId(),
      getSandboxPropertyId('string')
    ])
    const value = randomString()
    const res = await wbEdit.claim.create({ id: qid, property: pid, value, rank: 'preferred' })
    res.claim.rank.should.equal('preferred')
  })
})
