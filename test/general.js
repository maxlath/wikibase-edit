require('should')
const wdEdit = require('..')
const credentialConfig = {
  username: 'bla',
  password: 'bla'
}

describe('general', () => {
  it('should be a function', (done) => {
    wdEdit.should.be.a.Function()
    done()
  })
  it('should return an object', (done) => {
    wdEdit(credentialConfig).should.be.an.Object()
    done()
  })
  it('should have label functions', (done) => {
    wdEdit(credentialConfig).label.should.be.a.Object()
    wdEdit(credentialConfig).label.set.should.be.a.Function()
    done()
  })
  it('should have description functions', (done) => {
    wdEdit(credentialConfig).description.should.be.a.Object()
    wdEdit(credentialConfig).description.set.should.be.a.Function()
    done()
  })
  it('should have claim functions', (done) => {
    wdEdit(credentialConfig).claim.should.be.a.Object()
    wdEdit(credentialConfig).claim.exists.should.be.a.Function()
    wdEdit(credentialConfig).claim.add.should.be.a.Function()
    wdEdit(credentialConfig).claim.remove.should.be.a.Function()
    done()
  })
  it('should have reference functions', (done) => {
    wdEdit(credentialConfig).reference.should.be.a.Object()
    wdEdit(credentialConfig).reference.add.should.be.a.Function()
    done()
  })
  it('should have entity functions', (done) => {
    wdEdit(credentialConfig).entity.should.be.a.Object()
    wdEdit(credentialConfig).entity.create.should.be.a.Function()
    wdEdit(credentialConfig).entity.edit.should.be.a.Function()
    done()
  })
})

describe('with credentials', () => {
  it('should throw if not passed a username', (done) => {
    (() => wdEdit({ password: 'bla' })).should.throw()
    done()
  })
  it('should throw if not passed a password', (done) => {
    (() => wdEdit({ username: 'bla' })).should.throw()
    done()
  })
})

describe('with oauth', () => {
  it('should not throw if passed an oauth object', (done) => {
    (() => wdEdit({ oauth: {} })).should.not.throw()
    done()
  })
})
