require('should')
const CONFIG = require('config')
const wbEdit = require('..')(CONFIG)
const { randomString, sandboxEntity: id } = require('./utils')
const language = 'fr'

describe('integration', function () {
  this.timeout(20 * 1000)

  describe('label', () => {
    describe('set', () => {
      xit('should set a label', done => {
        const value = `Bac à Sable (${randomString()})`
        wbEdit.label.set(CONFIG, { id, language, value })
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
      xit('should set a description', done => {
        const value = `Bac à Sable (${randomString()})`
        wbEdit.description.set(CONFIG, { id, language, value })
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
      xit('should set an alias', done => {
        const value = randomString(4)
        wbEdit.alias.set(CONFIG, { id, language, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })

    describe('add', () => {
      xit('should add an alias', done => {
        const value = randomString(4)
        wbEdit.alias.add(CONFIG, { id, language, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })

    describe('remove', () => {
      xit('should remove an alias', done => {
        const value = randomString(4)
        wbEdit.alias.remove(CONFIG, { id, language, value })
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
        wbEdit.claim.add(CONFIG, { id, property, value })
        .then(res => {
          res.success.should.equal(1)
          done()
        })
        .catch(done)
      })
    })
  })
})
