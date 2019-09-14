require('should')
const { __ } = require('config')
const mergeEntity = __.require('lib/entity/merge')

describe('entity merge', () => {
  describe('items', () => {
    it('should set the action to wbmergeitems', done => {
      mergeEntity({ from: 'Q1', to: 'Q2' }).action.should.equal('wbmergeitems')
      done()
    })

    it('should reject invalid item ids', done => {
      mergeEntity.bind(null, { from: 'Q1', to: 'P' }).should.throw()
      mergeEntity.bind(null, { from: '1', to: 'Q2' }).should.throw()
      done()
    })
  })

  describe('properties', () => {
    it('should reject properties', done => {
      mergeEntity.bind(null, { from: 'P1', to: 'P2' }).should.throw()
      done()
    })
  })
})
