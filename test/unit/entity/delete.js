require('should')
const { __ } = require('config')
const { sandboxEntity: id } = __.require('test/unit/utils')
const deleteEntity = __.require('lib/entity/delete')

describe('entity delete', () => {
  it('should set the action to delete', done => {
    deleteEntity({ id }).action.should.equal('delete')
    done()
  })

  it('should set the title to the entity id', done => {
    deleteEntity({ id }).data.title.should.equal(id)
    done()
  })

  it('should reject invalid entity ids', done => {
    deleteEntity.bind(null, { id: 'bla' }).should.throw()
    deleteEntity.bind(null, { id: 'Item:Q1' }).should.throw()
    deleteEntity.bind(null, { id: 'Property:P1' }).should.throw()
    done()
  })
})
