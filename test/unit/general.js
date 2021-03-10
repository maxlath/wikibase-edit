require('module-alias/register')
require('should')
const wdEdit = require('root')

describe('general', () => {
  it('should return an object', () => {
    wdEdit({}).should.be.an.Object()
  })

  it('should have label functions', () => {
    wdEdit({}).label.set.should.be.a.Function()
  })

  it('should have description functions', () => {
    wdEdit({}).description.set.should.be.a.Function()
  })

  it('should have alias functions', () => {
    wdEdit({}).alias.set.should.be.a.Function()
    wdEdit({}).alias.add.should.be.a.Function()
    wdEdit({}).alias.remove.should.be.a.Function()
  })

  it('should have claim functions', () => {
    wdEdit({}).claim.create.should.be.a.Function()
    wdEdit({}).claim.update.should.be.a.Function()
    wdEdit({}).claim.remove.should.be.a.Function()
  })

  it('should have qualifier functions', () => {
    wdEdit({}).qualifier.set.should.be.a.Function()
    wdEdit({}).qualifier.update.should.be.a.Function()
    wdEdit({}).qualifier.remove.should.be.a.Function()
  })

  it('should have reference functions', () => {
    wdEdit({}).reference.set.should.be.a.Function()
    wdEdit({}).qualifier.update.should.be.a.Function()
    wdEdit({}).reference.remove.should.be.a.Function()
  })

  it('should have entity functions', () => {
    wdEdit({}).entity.create.should.be.a.Function()
    wdEdit({}).entity.edit.should.be.a.Function()
  })

  it('should have auth functions', () => {
    wdEdit({}).getAuthData.should.be.a.Function()
  })
})
