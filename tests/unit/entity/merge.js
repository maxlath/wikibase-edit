require('module-alias/register')
require('should')
const mergeEntity = require('lib/entity/merge')

describe('entity merge', () => {
  describe('items', () => {
    it('should set the action to wbmergeitems', () => {
      mergeEntity({ from: 'Q1', to: 'Q2' }).action.should.equal('wbmergeitems')
    })

    it('should reject invalid item ids', () => {
      mergeEntity.bind(null, { from: 'Q1', to: 'P' }).should.throw()
      mergeEntity.bind(null, { from: '1', to: 'Q2' }).should.throw()
    })
  })

  describe('properties', () => {
    it('should reject properties', () => {
      mergeEntity.bind(null, { from: 'P1', to: 'P2' }).should.throw()
    })
  })
})
