require('should')
const { __ } = require('config')
const wdEdit = __.require('.')
const instance = 'https://www.wikidata.org'
const credentialConfig = {
  instance,
  username: 'bla',
  password: 'bla'
}

describe('general', () => {
  it('should return an object', done => {
    wdEdit(credentialConfig).should.be.an.Object()
    done()
  })
  it('should have label functions', done => {
    wdEdit(credentialConfig).label.set.should.be.a.Function()
    done()
  })
  it('should have description functions', done => {
    wdEdit(credentialConfig).description.set.should.be.a.Function()
    done()
  })
  it('should have alias functions', done => {
    wdEdit(credentialConfig).alias.add.should.be.a.Function()
    wdEdit(credentialConfig).alias.remove.should.be.a.Function()
    wdEdit(credentialConfig).alias.set.should.be.a.Function()
    done()
  })
  it('should have claim functions', done => {
    wdEdit(credentialConfig).claim.add.should.be.a.Function()
    wdEdit(credentialConfig).claim.update.should.be.a.Function()
    wdEdit(credentialConfig).claim.remove.should.be.a.Function()
    done()
  })
  it('should have qualifier functions', done => {
    wdEdit(credentialConfig).qualifier.add.should.be.a.Function()
    // wdEdit(credentialConfig).qualifier.update.should.be.a.Function()
    wdEdit(credentialConfig).qualifier.remove.should.be.a.Function()
    done()
  })
  it('should have reference functions', done => {
    wdEdit(credentialConfig).reference.add.should.be.a.Function()
    wdEdit(credentialConfig).reference.remove.should.be.a.Function()
    done()
  })
  it('should have entity functions', done => {
    wdEdit(credentialConfig).entity.create.should.be.a.Function()
    wdEdit(credentialConfig).entity.edit.should.be.a.Function()
    done()
  })
})
