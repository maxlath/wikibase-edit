require('should')
const wdEdit = require('..')
const config = {
  username: 'bla',
  password: 'bla'
}

describe('general', () => {
  it('should be a function', (done) => {
    wdEdit.should.be.a.Function()
    done()
  })
  it('should throw if not passed a username', (done) => {
    (() => wdEdit({ password: 'bla' })).should.throw()
    done()
  })
  it('should throw if not passed a password', (done) => {
    (() => wdEdit({ username: 'bla' })).should.throw()
    done()
  })
  it('should return an object', (done) => {
    wdEdit(config).should.be.an.Object()
    done()
  })
  it('should have label functions', (done) => {
    wdEdit(config).label.should.be.a.Object()
    wdEdit(config).label.set.should.be.a.Function()
    done()
  })
  it('should have claim functions', (done) => {
    wdEdit(config).claim.should.be.a.Object()
    wdEdit(config).claim.exists.should.be.a.Function()
    wdEdit(config).claim.add.should.be.a.Function()
    done()
  })
  it('should have reference functions', (done) => {
    wdEdit(config).reference.should.be.a.Object()
    wdEdit(config).reference.add.should.be.a.Function()
    done()
  })
  it('should have entity functions', (done) => {
    wdEdit(config).entity.should.be.a.Object()
    wdEdit(config).entity.edit.should.be.a.Function()
    done()
  })
})
