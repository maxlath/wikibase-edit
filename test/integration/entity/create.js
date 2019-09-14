require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const { getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')

describe('entity create', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should create a property', done => {
    wbEdit.entity.create({
      type: 'property',
      datatype: 'external-id',
      labels: {
        en: randomString()
      }
    })
    .then(res => {
      res.success.should.equal(1)
      res.entity.type.should.equal('property')
      done()
    })
    .catch(done)
  })

  it('should create an item', done => {
    Promise.all([
      getSandboxPropertyId('string'),
      getSandboxPropertyId('external-id'),
      getSandboxPropertyId('url')
    ])
    .then(([pidA, pidB, pidC]) => {
      const claims = {}
      claims[pidA] = { value: randomString(), qualifiers: {}, references: {} }
      claims[pidA].qualifiers[pidB] = randomString()
      claims[pidA].references[pidC] = 'http://foo.bar'
      return wbEdit.entity.create({
        type: 'item',
        labels: { en: randomString() },
        description: { en: randomString() },
        aliases: { en: randomString() },
        claims
      })
      .then(res => {
        res.success.should.equal(1)
        done()
      })
    })
    .catch(done)
  })
})
