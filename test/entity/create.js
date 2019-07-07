require('should')
const createEntity = require('../../lib/entity/create')
const { randomString } = require('../utils')

describe('entity create', () => {
  it('should set the action to wbeditentity', done => {
    createEntity({ labels: { fr: 'foo' } }).action.should.equal('wbeditentity')
    done()
  })

  it('should then use entity.edit validation features', done => {
    try {
      createEntity({ claims: { P31: 'bla' } })
    } catch (err) {
      err.message.should.equal('invalid entity value')
      done()
    }
  })

  it('should format an item', done => {
    const label = `wikidata-edit entity.create test (${randomString()})`
    const description = randomString()
    const frAlias = randomString()
    const enAlias = randomString()
    const { data } = createEntity({
      labels: { en: label },
      aliases: { fr: frAlias, en: [ enAlias ] },
      descriptions: { fr: description },
      claims: { P17: 'Q166376' }
    })
    data.new.should.equal('item')
    JSON.parse(data.data).should.deepEqual({
      labels: { en: { language: 'en', value: label } },
      aliases: {
        fr: [ { language: 'fr', value: frAlias } ],
        en: [ { language: 'en', value: enAlias } ]
      },
      descriptions: {
        fr: { language: 'fr', value: description }
      },
      claims: {
        P17: [
          {
            rank: 'normal',
            type: 'statement',
            mainsnak: {
              property: 'P17',
              snaktype: 'value',
              datavalue: {
                type: 'wikibase-entityid',
                value: { 'entity-type': 'item', 'numeric-id': 166376 }
              }
            }
          }
        ]
      }
    })
    done()
  })

  it('should reject a property creation without type', done => {
    try {
      createEntity({ datatype: 'string' })
    } catch (err) {
      err.message.should.equal("an item can't have a datatype")
      done()
    }
  })

  it('should reject a property creation without datatype', done => {
    try {
      createEntity({ type: 'property' })
    } catch (err) {
      err.message.should.equal('missing property datatype')
      done()
    }
  })

  it('should create a property', done => {
    const label = `wikidata-edit entity.create property test (${randomString()})`
    const { data } = createEntity({
      type: 'property',
      datatype: 'string',
      labels: { en: label },
    })
    data.new.should.equal('property')
    JSON.parse(data.data).should.deepEqual({
      datatype: 'string',
      labels: { en: { language: 'en', value: label } }
    })
    done()
  })
})
