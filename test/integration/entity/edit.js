require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const { getSandboxItemId, getSandboxPropertyId } = __.require('test/integration/utils/sandbox_entities')

describe('entity edit', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should edit an item', done => {
    const label = randomString()
    getSandboxItemId()
    .then(id => {
      return wbEdit.entity.edit({
        id,
        labels: { nl: label }
      })
      .then(res => {
        res.entity.labels.nl.value.should.equal(label)
        done()
      })
    })
    .catch(done)
  })

  it('should clear and edit an item', done => {
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
      const params = {
        labels: { en: randomString() },
        description: { en: randomString() },
        aliases: { en: randomString() },
        claims
      }
      return wbEdit.entity.create(params)
      .then(res => {
        const newLabel = randomString()
        return wbEdit.entity.edit({
          id: res.entity.id,
          clear: true,
          labels: {
            en: newLabel
          }
        })
        .then(res => {
          res.success.should.equal(1)
          const { entity } = res
          entity.labels.should.deepEqual({ en: { language: 'en', value: newLabel } })
          entity.descriptions.should.deepEqual({})
          entity.aliases.should.deepEqual({})
          entity.claims.should.deepEqual({})
          done()
        })
      })
    })
    .catch(done)
  })
})
