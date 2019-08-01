require('should')
const config = require('config')
const wbEdit = require('../..')(config)
const { randomString } = require('../utils')
const { getSandboxPropertyId, getSandboxItemId, getSandboxClaim } = require('./sandbox_entities')
const language = 'fr'
const { isGuid } = require('wikibase-sdk')

describe('primitives', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('./wait_for_instance'))

  describe('label', () => {
    describe('set', () => {
      it('should set a label', done => {
        getSandboxItemId()
        .then(id => {
          const value = `Bac à Sable (${randomString()})`
          return wbEdit.label.set({ id, language, value })
          .then(res => {
            res.success.should.equal(1)
            done()
          })
        })
        .catch(done)
      })
    })
  })

  describe('description', () => {
    describe('set', () => {
      it('should set a description', done => {
        getSandboxItemId()
        .then(id => {
          const value = `Bac à Sable (${randomString()})`
          return wbEdit.description.set({ id, language, value })
          .then(res => {
            res.success.should.equal(1)
            done()
          })
        })
        .catch(done)
      })
    })
  })

  describe('alias', () => {
    describe('set', () => {
      it('should set an alias', done => {
        getSandboxItemId()
        .then(id => {
          const value = randomString()
          return wbEdit.alias.set({ id, language, value })
          .then(res => {
            res.success.should.equal(1)
            done()
          })
        })
        .catch(done)
      })
    })

    describe('add', () => {
      it('should add an alias', done => {
        getSandboxItemId()
        .then(id => {
          const value = randomString()
          return wbEdit.alias.add({ id, language, value })
          .then(res => {
            res.success.should.equal(1)
            done()
          })
        })
        .catch(done)
      })
    })

    describe('remove', () => {
      it('should remove an alias', done => {
        getSandboxItemId()
        .then(id => {
          const value = randomString()
          return wbEdit.alias.remove({ id, language, value })
          .then(res => {
            res.success.should.equal(1)
            done()
          })
        })
        .catch(done)
      })
    })
  })

  describe('claim', () => {
    describe('add', () => {
      it('should add a claim', done => {
        Promise.all([
          getSandboxItemId(),
          getSandboxPropertyId('string')
        ])
        .then(([ qid, pid ]) => {
          const value = randomString()
          return wbEdit.claim.add({ id: qid, property: pid, value })
          .then(res => {
            res.success.should.equal(1)
            isGuid(res.claim.id).should.be.true()
            res.claim.rank.should.equal('normal')
            res.claim.mainsnak.snaktype.should.equal('value')
            res.claim.mainsnak.datavalue.value.should.equal(value)
            done()
          })
        })
        .catch(done)
      })
    })

    describe('set', () => {
      it('should set a claim', done => {
        getSandboxClaim()
        .then(claim => {
          const { property } = claim.mainsnak
          const value = randomString()
          return wbEdit.claim.set({ guid: claim.id, property, value })
          .then(res => {
            res.claim.mainsnak.datavalue.value.should.equal(value)
            done()
          })
        })
        .catch(done)
      })
    })
  })

  describe('entity', () => {
    describe('create', () => {
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
  })
})
