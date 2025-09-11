import 'should'
import deleteEntity from '#lib/entity/delete'
import { someEntityId as id } from '#tests/unit/utils'

describe('entity delete', () => {
  it('should set the action to delete', () => {
    deleteEntity({ id }).action.should.equal('delete')
  })

  it('should set the title to the entity id', () => {
    deleteEntity({ id }).data.title.should.equal(id)
  })

  it('should reject invalid entity ids', () => {
    deleteEntity.bind(null, { id: 'bla' }).should.throw()
    deleteEntity.bind(null, { id: 'Item:Q1' }).should.throw()
    deleteEntity.bind(null, { id: 'Property:P1' }).should.throw()
  })
})
