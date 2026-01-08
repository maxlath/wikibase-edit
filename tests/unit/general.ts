import 'should'
import WBEdit from '../../src/lib/index.js'

describe('general', () => {
  it('should return an object', () => {
    WBEdit({}).should.be.an.Object()
  })

  it('should have label functions', () => {
    WBEdit({}).label.set.should.be.a.Function()
  })

  it('should have description functions', () => {
    WBEdit({}).description.set.should.be.a.Function()
  })

  it('should have alias functions', () => {
    WBEdit({}).alias.set.should.be.a.Function()
    WBEdit({}).alias.add.should.be.a.Function()
    WBEdit({}).alias.remove.should.be.a.Function()
  })

  it('should have claim functions', () => {
    WBEdit({}).claim.create.should.be.a.Function()
    WBEdit({}).claim.update.should.be.a.Function()
    WBEdit({}).claim.remove.should.be.a.Function()
  })

  it('should have qualifier functions', () => {
    WBEdit({}).qualifier.set.should.be.a.Function()
    WBEdit({}).qualifier.update.should.be.a.Function()
    WBEdit({}).qualifier.remove.should.be.a.Function()
  })

  it('should have reference functions', () => {
    WBEdit({}).reference.set.should.be.a.Function()
    WBEdit({}).qualifier.update.should.be.a.Function()
    WBEdit({}).reference.remove.should.be.a.Function()
  })

  it('should have entity functions', () => {
    WBEdit({}).entity.create.should.be.a.Function()
    WBEdit({}).entity.edit.should.be.a.Function()
  })

  it('should have auth functions', () => {
    WBEdit({}).getAuthData.should.be.a.Function()
  })
})
