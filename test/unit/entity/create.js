require('should')
const { __, instance } = require('config')
const { randomString, properties } = __.require('test/unit/utils')
const _createEntity = __.require('lib/entity/create')
const createEntity = params => _createEntity(params, properties, instance)

describe('entity create', () => {
  it('should reject parameters with an id', done => {
    const params = { id: 'Q3' }
    createEntity.bind(null, params).should.throw("a new entity can't already have an id")
    done()
  })

  it('should set the action to wbeditentity', done => {
    const params = { labels: { fr: 'foo' } }
    createEntity(params).action.should.equal('wbeditentity')
    done()
  })

  it('should then use entity.edit validation features', done => {
    const params = { claims: { P2: 'bla' } }
    createEntity.bind(null, params).should.throw('invalid entity value')
    done()
  })

  it('should format an item', done => {
    const label = randomString()
    const description = randomString()
    const frAlias = randomString()
    const enAlias = randomString()
    const params = {
      labels: { en: label },
      aliases: { fr: frAlias, en: [ enAlias ] },
      descriptions: { fr: description },
      claims: { P2: 'Q166376' }
    }
    const { data } = createEntity(params)
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
        P2: [
          {
            rank: 'normal',
            type: 'statement',
            mainsnak: {
              property: 'P2',
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
    createEntity.bind(null, { datatype: 'string' })
    .should.throw("an item can't have a datatype")
    done()
  })

  it('should reject a property creation without datatype', done => {
    createEntity.bind(null, { type: 'property' })
    .should.throw('missing property datatype')
    done()
  })

  it('should create a property', done => {
    const label = randomString()
    const params = {
      type: 'property',
      datatype: 'string',
      labels: { en: label }
    }
    const { data } = createEntity(params)
    data.new.should.equal('property')
    JSON.parse(data.data).should.deepEqual({
      datatype: 'string',
      labels: { en: { language: 'en', value: label } }
    })
    done()
  })
})
