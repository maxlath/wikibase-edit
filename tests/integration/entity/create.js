import 'should'
import config from 'config'
import { getSandboxPropertyId } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import wbEditFactory from '#root'

const wbEdit = wbEditFactory(config)

describe('entity create', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should create a property', async () => {
    const res = await wbEdit.entity.create({
      type: 'property',
      datatype: 'external-id',
      labels: {
        en: randomString(),
      },
    })
    res.success.should.equal(1)
    res.entity.type.should.equal('property')
  })

  it('should create an item', async () => {
    const [ pidA, pidB, pidC ] = await Promise.all([
      getSandboxPropertyId('string'),
      getSandboxPropertyId('external-id'),
      getSandboxPropertyId('url'),
    ])
    const claims = {}
    claims[pidA] = { value: randomString(), qualifiers: {}, references: {} }
    claims[pidA].qualifiers[pidB] = randomString()
    claims[pidA].references[pidC] = 'http://foo.bar'
    const res = await wbEdit.entity.create({
      type: 'item',
      labels: { en: randomString() },
      descriptions: { en: randomString() },
      aliases: { en: randomString() },
      claims,
    })
    res.success.should.equal(1)
  })
})
