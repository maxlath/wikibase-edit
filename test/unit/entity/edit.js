require('should')
const { instance } = require('config')
const { randomString, someEntityId: id, properties } = require('test/unit/utils')
const _editEntity = require('lib/entity/edit')
const editEntity = params => _editEntity(params, properties, instance)

describe('entity edit', () => {
  it('should reject a missing id', () => {
    const params = { claims: { someWikibaseItemPropertyId: 'bla' } }
    editEntity.bind(null, params).should.throw('invalid entity id')
  })

  it('should reject an edit without data', () => {
    const params = { id }
    editEntity.bind(null, params).should.throw('no data was passed')
  })

  it('should reject invalid claims', () => {
    const params = { id, claims: { P2: 'bla' } }
    editEntity.bind(null, params).should.throw('invalid entity value')
  })

  it('should reject invalid labels', () => {
    const params = { id, labels: { fr: '' } }
    editEntity.bind(null, params).should.throw('invalid label')
  })

  it('should reject invalid descriptions', () => {
    const params = { id, descriptions: { fr: '' } }
    editEntity.bind(null, params).should.throw('invalid description')
  })

  it('should set the action to wbeditentity', () => {
    const params = { id, labels: { fr: 'foo' } }
    editEntity(params).action.should.equal('wbeditentity')
  })

  it('should return formatted data', () => {
    const label = randomString()
    const description = randomString()
    const frAlias = randomString()
    const enAlias = randomString()
    const { data } = editEntity({
      id,
      labels: { fr: label },
      aliases: { fr: frAlias, en: [ enAlias ] },
      descriptions: { fr: description },
      claims: { P2: 'Q3576110' }
    })
    data.id.should.equal(id)
    JSON.parse(data.data).should.deepEqual({
      labels: {
        fr: { language: 'fr', value: label }
      },
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
                value: {
                  'entity-type': 'item',
                  'numeric-id': 3576110
                }
              }
            }
          }
        ]
      }
    })
  })

  it('should format an entity claim with qualifiers', () => {
    const { data } = editEntity({
      id,
      claims: {
        P2: [
          { value: 'Q5111731', qualifiers: { P1: '17', P2: [ 'Q13406268' ] } },
          {
            value: 'Q2622002',
            qualifiers: {
              P4: '1789-08-04',
              P8: { amount: 9001, unit: 'Q7727' },
              P9: { text: 'bulgroz', language: 'fr' }
            }
          }
        ]
      }
    })
    JSON.parse(data.data).claims.P2.should.deepEqual([
      {
        rank: 'normal',
        type: 'statement',
        mainsnak: {
          property: 'P2',
          snaktype: 'value',
          datavalue: {
            type: 'wikibase-entityid',
            value: { 'entity-type': 'item', 'numeric-id': 5111731 }
          }
        },
        qualifiers: {
          P1: [
            {
              property: 'P1',
              snaktype: 'value',
              datavalue: { type: 'string', value: '17' }
            }
          ],
          P2: [
            {
              property: 'P2',
              snaktype: 'value',
              datavalue: {
                type: 'wikibase-entityid',
                value: { 'entity-type': 'item', 'numeric-id': 13406268 }
              }
            }
          ]
        }
      },
      {
        rank: 'normal',
        type: 'statement',
        mainsnak: {
          property: 'P2',
          snaktype: 'value',
          datavalue: {
            type: 'wikibase-entityid',
            value: { 'entity-type': 'item', 'numeric-id': 2622002 }
          }
        },
        qualifiers: {
          P4: [
            {
              property: 'P4',
              snaktype: 'value',
              datavalue: {
                type: 'time',
                value: {
                  time: '+1789-08-04T00:00:00Z',
                  timezone: 0,
                  before: 0,
                  after: 0,
                  precision: 11,
                  calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
                }
              }
            }
          ],
          P8: [
            {
              property: 'P8',
              snaktype: 'value',
              datavalue: {
                type: 'quantity',
                value: { amount: '+9001', unit: `${instance}/entity/Q7727` }
              }
            }
          ],
          P9: [
            {
              property: 'P9',
              snaktype: 'value',
              datavalue: {
                type: 'monolingualtext',
                value: { text: 'bulgroz', language: 'fr' }
              }
            }
          ]
        }
      }
    ])
  })

  it('should format an entity claim with rich qualifier', () => {
    const qualifiers = {
      P8: [ { value: { amount: 100, unit: 'Q6982035' } } ]
    }
    const { data } = editEntity({
      id,
      claims: {
        P2: [ { value: 'Q54173', qualifiers } ]
      }
    })
    JSON.parse(data.data).claims.P2[0].qualifiers.P8[0].should.deepEqual({
      property: 'P8',
      snaktype: 'value',
      datavalue: {
        type: 'quantity',
        value: {
          amount: '+100',
          unit: `${instance}/entity/Q6982035`
        }
      }
    })
  })

  it('should format an entity claim with a qualifier with a special snaktype', () => {
    const qualifiers = {
      P4: { snaktype: 'somevalue' }
    }
    const { data } = editEntity({
      id,
      claims: {
        P2: [ { value: 'Q54173', qualifiers } ]
      }
    })
    JSON.parse(data.data).claims.P2[0].qualifiers.P4[0].should.deepEqual({
      property: 'P4',
      snaktype: 'somevalue'
    })
  })

  it('should format an entity claim with a low precision time claim', () => {
    const qualifiers = {
      P4: { value: '2019-04-01T00:00:00.000Z' }
    }
    const { data } = editEntity({
      id,
      claims: {
        P2: [ { value: 'Q54173', qualifiers } ]
      }
    })
    JSON.parse(data.data).claims.P2[0].qualifiers.P4[0].should.deepEqual({
      property: 'P4',
      snaktype: 'value',
      datavalue: {
        type: 'time',
        value: {
          time: '+2019-04-01T00:00:00Z',
          timezone: 0,
          before: 0,
          after: 0,
          precision: 11,
          calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
        }
      }
    })
  })

  it('should format an entity claim with a time qualifier', () => {
    const qualifiers = {
      P4: { value: '2019-04-01T00:00:00.000Z' }
    }
    const { data } = editEntity({
      id,
      claims: {
        P2: [ { value: 'Q54173', qualifiers } ]
      }
    })
    JSON.parse(data.data).claims.P2[0].qualifiers.P4[0].should.deepEqual({
      property: 'P4',
      snaktype: 'value',
      datavalue: {
        type: 'time',
        value: {
          time: '+2019-04-01T00:00:00Z',
          timezone: 0,
          before: 0,
          after: 0,
          precision: 11,
          calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
        }
      }
    })
  })

  it('should format an entity claim with a reference', () => {
    const reference = {
      P7: 'https://example.org',
      P2: 'Q8447'
    }
    const { data } = editEntity({
      id,
      claims: {
        P2: { value: 'Q2622002', references: reference }
      }
    })
    JSON.parse(data.data).claims.P2[0].references[0].snaks.should.deepEqual([
      {
        property: 'P7',
        snaktype: 'value',
        datavalue: { type: 'string', value: 'https://example.org' }
      },
      {
        property: 'P2',
        snaktype: 'value',
        datavalue: {
          type: 'wikibase-entityid',
          value: { 'entity-type': 'item', 'numeric-id': 8447 }
        }
      }
    ])
  })

  it('should format an entity claim with a reference formatted with a snaks object', () => {
    const reference = {
      snaks: {
        P7: 'https://example.org',
        P2: 'Q8447'
      }
    }
    const { data } = editEntity({
      id,
      claims: {
        P2: { value: 'Q2622002', references: [ reference ] }
      }
    })
    JSON.parse(data.data).claims.P2[0].references[0].snaks[0]
    .datavalue.value.should.equal('https://example.org')
  })

  // xit('should format an entity claim with multiple references', () => {
  //   editEntity({
  //     id,
  //     claims: {
  //       P2: [
  //         {
  //           value: 'Q2622002',
  //           references: [
  //             { P7: 'https://example.org', P2: 'Q8447' },
  //             { P7: 'https://example2.org', P2: 'Q8447' }
  //           ]
  //         }
  //       ]
  //     }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     const lastClaim = res.entity.claims.P2.slice(-1)[0]
  //     const urlRef = lastClaim.references[0].snaks.P7[0]
  //     urlRef.datavalue.value.should.equal('https://example.org')
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity claim with a monolingual text claim', () => {
  //   editEntity({
  //     id,
  //     claims: { P9: { text: 'Lundeborg', 'language': 'mul' } }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity claim with a quantity claim', () => {
  //   editEntity({
  //     id,
  //     claims: { P8: { amount: 9001, unit: 'Q7727' } }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity claim with a rich value and qualifiers', () => {
  //   editEntity({
  //     id,
  //     claims: {
  //       P8: {
  //         value: { amount: 9002, unit: 'Q7727' },
  //         qualifiers: { P4: '1789-08-04' }
  //       }
  //     }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity claim with a globe coordinate claim', () => {
  //   editEntity({
  //     id,
  //     claims: { P6: { latitude: 45.758, longitude: 4.84138, precision: 1 / 360 } }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity claim with special snaktypes', () => {
  //   editEntity({
  //     id,
  //     claims: {
  //       P2: { snaktype: 'somevalue' },
  //       P6: { snaktype: 'novalue' }
  //     }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     res.entity.claims.P2.slice(-1)[0].mainsnak.snaktype.should.equal('somevalue')
  //     res.entity.claims.P6.slice(-1)[0].mainsnak.snaktype.should.equal('novalue')
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity claim with special rank', () => {
  //   editEntity({
  //     id,
  //     claims: {
  //       P2: { rank: 'deprecated', snaktype: 'somevalue' },
  //       P6: { rank: 'deprecated', latitude: 0.1, longitude: 0.1, precision: 1 / 360 },
  //       P8: { rank: 'preferred', value: 123 }
  //     }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     res.entity.claims.P2.slice(-1)[0].rank.should.equal('deprecated')
  //     res.entity.claims.P2.slice(-1)[0].mainsnak.snaktype.should.equal('somevalue')
  //     res.entity.claims.P6.slice(-1)[0].rank.should.equal('deprecated')
  //     res.entity.claims.P6.slice(-1)[0].mainsnak.datavalue.value.latitude.should.equal(0.1)
  //     res.entity.claims.P6.slice(-1)[0].mainsnak.datavalue.value.longitude.should.equal(0.1)
  //     res.entity.claims.P6.slice(-1)[0].mainsnak.datavalue.value.precision.should.equal(0.0027777777777778)
  //     res.entity.claims.P8.slice(-1)[0].rank.should.equal('preferred')
  //     res.entity.claims.P8.slice(-1)[0].mainsnak.datavalue.value.amount.should.equal('+123')
  //   })
  //   .catch(done)
  // })

  // xit('should be able to remove a claim', () => {
  //   editEntity({
  //     id,
  //     claims: { P2: sandboxEntity }
  //   })
  //   .then(res => {
  //     const guid = res.entity.claims.P2.slice(-1)[0].id
  //     return editEntity({
  //       id,
  //       claims: { P2: { id: guid, remove: true } }
  //     })
  //     .then(res => {
  //       res.success.should.equal(1)
  //       const propClaims = res.entity.claims.P2
  //       if (propClaims) {
  //         const guids = propClaims.map(claim => claim.id)
  //         guids.includes(guid).should.be.false()
  //       }
  //     })
  //   })
  //   .catch(done)
  // })

  // xit('should be able to remove a label, description, or alias', () => {
  //   const label = randomString()
  //   const description = randomString()
  //   const alias = randomString()
  //   editEntity({
  //     id,
  //     labels: { la: label },
  //     descriptions: { la: description },
  //     aliases: { la: alias }
  //   })
  //   .then(res => {
  //     return editEntity({
  //       id,
  //       labels: { la: { value: label, remove: true } },
  //       descriptions: { la: { value: description, remove: true } },
  //       aliases: { la: { value: alias, remove: true } }
  //     })
  //     .then(res => {
  //       res.success.should.equal(1)
  //       should(res.entity.labels.la).not.be.ok()
  //       should(res.entity.descriptions.la).not.be.ok()
  //       if (res.entity.aliases.la != null) {
  //         res.entity.aliases.la.forEach(alias => {
  //           alias.value.should.not.equal('foo')
  //         })
  //       }
  //     })
  //   })
  //   .catch(done)
  // })

  // xit('should be able to add and remove a sitelink', () => {
  //   const frwikinews = 'Évènements du 16 novembre 2018'
  //   editEntity({
  //     id,
  //     sitelinks: { frwikinews }
  //   })
  //   .then(res => {
  //     res.entity.sitelinks.frwikinews.title.should.equal(frwikinews)
  //     return editEntity({
  //       id,
  //       sitelinks: { frwikinews: { value: frwikinews, remove: true } }
  //     })
  //     .then(res => {
  //       should(res.entity.sitelinks.frwikinews).not.be.ok()
  //     })
  //   })
  //   .catch(done)
  // })

  // xit('should edit the existing claim when passed an id', () => {
  //   editEntity({
  //     id,
  //     claims: { P1: 'ABC' }
  //   })
  //   .then(res => {
  //     const claim = res.entity.claims.P1.slice(-1)[0]
  //     return editEntity({
  //       id,
  //       claims: { P1: { id: claim.id, value: 'DEF', rank: 'preferred' } }
  //     })
  //     .then(res => {
  //       const updatedClaim = res.entity.claims.P1.find(propClaim => propClaim.id === claim.id)
  //       console.log('updatedClaim', updatedClaim)
  //       updatedClaim.mainsnak.datavalue.value.should.equal('DEF')
  //       updatedClaim.rank.should.equal('preferred')
  //     })
  //   })
  //   .catch(done)
  // })
})
