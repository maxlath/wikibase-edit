require('should')
const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const updateQualifier = wbEdit.qualifier.update
const { undesiredRes } = __.require('test/integration/utils/utils')
const { getSandboxPropertyId, getSandboxClaimId } = __.require('test/integration/utils/sandbox_entities')
const { addQualifier } = __.require('test/integration/utils/sandbox_snaks')
const { randomString, randomNumber } = __.require('test/unit/utils')
const { simplify } = require('wikibase-sdk')

describe('qualifier update', function () {
  this.timeout(20 * 1000)
  before('wait for instance', __.require('test/integration/utils/wait_for_instance'))

  it('should update a qualifier', done => {
    const oldValue = randomString()
    const newValue = randomString()
    addQualifier('string', oldValue)
    .then(({ guid, property, qualifier }) => {
      return updateQualifier({ guid, property, oldValue, newValue })
      .then(res => {
        const qualifier = res.claim.qualifiers[property].slice(-1)[0]
        qualifier.datavalue.value.should.deepEqual(newValue)
        done()
      })
    })
    .catch(done)
  })

  it('should reject if old value is missing', done => {
    const oldValue = randomString()
    const newValue = randomString()
    Promise.all([
      getSandboxClaimId(),
      getSandboxPropertyId('string')
    ])
    .then(([ guid, property ]) => {
      return updateQualifier({ guid, property, oldValue, newValue })
      .then(undesiredRes(done))
      .catch(err => {
        const possibleMessages = [ 'claim qualifiers not found', 'qualifier not found' ]
        possibleMessages.includes(err.message).should.be.true()
        done()
      })
    })
    .catch(done)
  })

  it('should update a monolingual text claim', done => {
    const oldValue = { text: randomString(), language: 'fr' }
    const newValue = { text: randomString(), language: 'de' }
    addQualifier('monolingualtext', oldValue)
    .then(({ guid, property }) => {
      return updateQualifier({ guid, property, oldValue, newValue })
      .then(res => {
        const qualifier = res.claim.qualifiers[property].slice(-1)[0]
        qualifier.datavalue.value.should.deepEqual(newValue)
        done()
      })
    })
    .catch(done)
  })

  it('should update a quantity claim with a unit', done => {
    const oldValue = { amount: randomNumber(), unit: 'Q1' }
    const newValue = { amount: randomNumber(), unit: 'Q2' }
    addQualifier('quantity', oldValue)
    .then(({ guid, property }) => {
      return updateQualifier({ guid, property, oldValue, newValue })
      .then(res => {
        const qualifier = res.claim.qualifiers[property].slice(-1)[0]
        simplify.qualifier(qualifier, { keepRichValues: true }).should.deepEqual(newValue)
        done()
      })
    })
    .catch(done)
  })

  it('should update a time claim', done => {
    const oldYear = 1000 + randomNumber(3)
    const newYear = 1000 + randomNumber(3)
    const oldValue = `${oldYear}-02-26`
    const newValue = `${newYear}-10-25`
    addQualifier('time', oldValue)
    .then(({ guid, property }) => {
      return updateQualifier({ guid, property, oldValue, newValue })
      .then(res => {
        const qualifier = res.claim.qualifiers[property].slice(-1)[0]
        simplify.qualifier(qualifier, { timeConverter: 'simple-day' }).should.equal(newValue)
        done()
      })
    })
    .catch(done)
  })

  it('should update a globe-coordinate claim', done => {
    const oldValue = {
      latitude: randomNumber(2),
      longitude: randomNumber(2),
      precision: 0.01,
      globe: 'http://www.wikidata.org/entity/Q111'
    }
    const newValue = {
      latitude: randomNumber(2),
      longitude: randomNumber(2),
      precision: 0.01,
      globe: 'http://www.wikidata.org/entity/Q112'
    }
    addQualifier('globe-coordinate', oldValue)
    .then(({ guid, property }) => {
      return updateQualifier({ guid, property, oldValue, newValue })
      .then(res => {
        const qualifier = res.claim.qualifiers[property].slice(-1)[0]
        const { value } = qualifier.datavalue
        value.latitude.should.equal(newValue.latitude)
        value.longitude.should.equal(newValue.longitude)
        value.precision.should.equal(newValue.precision)
        value.globe.should.equal(newValue.globe)
        done()
      })
    })
    .catch(done)
  })

  it('should update a qualifier with a special snaktype', done => {
    const oldValue = { snaktype: 'novalue' }
    const newValue = { snaktype: 'somevalue' }
    addQualifier('string', oldValue)
    .then(({ guid, property, qualifier }) => {
      qualifier.snaktype.should.equal('novalue')
      return updateQualifier({ guid, property, oldValue, newValue })
      .then(res => {
        const updatedQualifier = res.claim.qualifiers[property].slice(-1)[0]
        updatedQualifier.snaktype.should.equal('somevalue')
        done()
      })
    })
    .catch(done)
  })
})
