require('should')
const { __ } = require('config')
const wdEdit = __.require('.')

describe('general', () => {
  it('should return an object', done => {
    wdEdit({}).should.be.an.Object()
    done()
  })

  it('should have label functions', done => {
    wdEdit({}).label.set.should.be.a.Function()
    done()
  })

  it('should have description functions', done => {
    wdEdit({}).description.set.should.be.a.Function()
    done()
  })

  it('should have alias functions', done => {
    wdEdit({}).alias.set.should.be.a.Function()
    wdEdit({}).alias.add.should.be.a.Function()
    wdEdit({}).alias.remove.should.be.a.Function()
    done()
  })

  it('should have claim functions', done => {
    wdEdit({}).claim.create.should.be.a.Function()
    wdEdit({}).claim.update.should.be.a.Function()
    wdEdit({}).claim.remove.should.be.a.Function()
    done()
  })

  it('should have qualifier functions', done => {
    wdEdit({}).qualifier.set.should.be.a.Function()
    wdEdit({}).qualifier.update.should.be.a.Function()
    wdEdit({}).qualifier.remove.should.be.a.Function()
    done()
  })

  it('should have reference functions', done => {
    wdEdit({}).reference.set.should.be.a.Function()
    wdEdit({}).qualifier.update.should.be.a.Function()
    wdEdit({}).reference.remove.should.be.a.Function()
    done()
  })

  it('should have entity functions', done => {
    wdEdit({}).entity.create.should.be.a.Function()
    wdEdit({}).entity.edit.should.be.a.Function()
    done()
  })
})
