require('should')
const config = require('config')
const wbEdit = require('../..')(config)
const { randomString, sandboxEntity: id } = require('../utils')
const { createProperty } = require('./utils')
const language = 'fr'

describe('integration', function () {
  this.timeout(20 * 1000)

  describe('label', () => {
    describe('set', () => {
      it('should set a label', done => {
        const value = `Bac à Sable (${randomString()})`
        wbEdit.label.set(config, { id, language, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })
  })

  describe('description', () => {
    describe('set', () => {
      it('should set a description', done => {
        const value = `Bac à Sable (${randomString()})`
        wbEdit.description.set(config, { id, language, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })
  })

  describe('alias', () => {
    describe('set', () => {
      it('should set an alias', done => {
        const value = randomString(4)
        wbEdit.alias.set(config, { id, language, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })

    describe('add', () => {
      it('should add an alias', done => {
        const value = randomString(4)
        wbEdit.alias.add(config, { id, language, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })

    describe('remove', () => {
      it('should remove an alias', done => {
        const value = randomString(4)
        wbEdit.alias.remove(config, { id, language, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })
  })

  describe('claim', () => {
    describe('add', () => {
      it('should add a claim', done => {
        const value = randomString(4)
        const property = 'P600'
        wbEdit.claim.add(config, { id, property, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })
  })

  describe('entity', () => {
    describe('create', () => {
      it('should create an item', done => {
        Promise.all([
          createProperty('string'),
          createProperty('external-id'),
          createProperty('url')
        ])
        .then(([pidA, pidB, pidC]) => {
          const claims = {}
          claims[pidA] = { value: randomString(4), qualifiers: {}, references: {} }
          claims[pidA].qualifiers[pidB] = randomString(4)
          claims[pidA].references[pidC] = 'http://foo.bar'
          return wbEdit.entity.create(config, {
            type: 'item',
            labels: { en: randomString(4) },
            description: { en: randomString(4) },
            aliases: { en: randomString(4) },
            claims
          })
          .then(res => {
            console.log('res', JSON.stringify(res, null, 2))
            res.success.should.equal(1)
            done()
          })
        })
        .catch(done)
      })
    })
  })
})
