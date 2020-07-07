require('should')
const { __, instance } = require('config')
const { randomString, properties } = __.require('test/unit/utils')
const _createEntity = __.require('lib/entity/create')
const createEntity = params => _createEntity(params, properties, instance)

describe('entity create', () => {
  it('should reject parameters with an id', () => {
    const params = { id: 'Q3' }
    createEntity.bind(null, params).should.throw("a new entity can't already have an id")
  })

  it('should set the action to wbeditentity', () => {
    const params = { labels: { fr: 'foo' } }
    createEntity(params).action.should.equal('wbeditentity')
  })

  it('should then use entity.edit validation features', () => {
    const params = { claims: { P2: 'bla' } }
    createEntity.bind(null, params).should.throw('invalid entity value')
  })

  it('should format an item', () => {
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
  })

  it('should reject a property creation without type', () => {
    createEntity.bind(null, { datatype: 'string' })
    .should.throw("an item can't have a datatype")
  })

  it('should reject a property creation without datatype', () => {
    createEntity.bind(null, { type: 'property' })
    .should.throw('missing property datatype')
  })

  it('should create a property', () => {
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
  })
})
