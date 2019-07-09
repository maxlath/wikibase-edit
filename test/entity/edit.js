const should = require('should')
const editEntity = require('../../lib/entity/edit')
const { randomString, sandboxEntity: id, sandboxDescriptionFr, properties } = require('../utils')

describe('entity edit', () => {
  it('should reject a missing id', done => {
    const params = { claims: { P31: 'bla' } }
    editEntity.bind(null, params, properties).should.throw('invalid entity id')
    done()
  })

  it('should reject an edit without data', done => {
    const params = { id }
    editEntity.bind(null, params, properties).should.throw('no data was passed')
    done()
  })

  it('should reject invalid claims', done => {
    const params = { id, claims: { P31: 'bla' } }
    editEntity.bind(null, params, properties).should.throw('invalid entity value')
    done()
  })

  it('should reject invalid labels', done => {
    const params = { id, labels: { fr: '' } }
    editEntity.bind(null, params, properties).should.throw('invalid label')
    done()
  })

  it('should reject invalid descriptions', done => {
    const params = { id, descriptions: { fr: '' } }
    editEntity.bind(null, params, properties).should.throw('invalid description')
    done()
  })

  it('should set the action to wbeditentity', done => {
    const params = { id, labels: { fr: 'foo' } }
    editEntity(params, properties).action.should.equal('wbeditentity')
    done()
  })

  it('should return formatted data', done => {
    const label = `Bac à Sable (${randomString()})`
    const description = `${sandboxDescriptionFr} (${randomString()})`
    const frAlias = `bàs ${randomString()}`
    const enAlias = `sandbox ${randomString()}`
    var { data } = editEntity({
      id,
      labels: { fr: label },
      aliases: { fr: frAlias, en: [ enAlias ] },
      descriptions: { fr: description },
      claims: { P1775: 'Q3576110' }
    }, properties)
    data.id.should.equal(id)
    JSON.parse(data.data).should.deepEqual({
      labels: {
        fr: { language: 'fr', value: label }
      },
      aliases: {
        fr: [ { language: 'fr', value: frAlias } ],
        en:[ { language: 'en', value: enAlias} ]
      },
      descriptions: {
        fr:{ language: 'fr', value: description }
      },
      claims: {
        P1775: [
          {
            rank: 'normal',
            type: 'statement',
            mainsnak:{
              property: 'P1775',
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
    done()
  })

  it('should format an entity with qualifiers', done => {
    const { data } = editEntity({
      id,
      claims: {
        P369: [
          { value: 'Q5111731', qualifiers: { P1545: '17', P1416: [ 'Q13406268' ] } },
          {
            value: 'Q2622002',
            qualifiers: {
              P580: '1789-08-04',
              P1106: { amount: 9001, unit: 'Q7727' },
              P1476: { text: 'bulgroz', language: 'fr' }
            }
          }
        ]
      }
    }, properties)
    JSON.parse(data.data).claims.P369.should.deepEqual([
      {
        rank: 'normal',
        type: 'statement',
        mainsnak: {
          property: 'P369',
          snaktype: 'value',
          datavalue: {
            type: 'wikibase-entityid',
            value: { 'entity-type': 'item', 'numeric-id': 5111731 }
          }
        },
        qualifiers: {
          P1545: [
            {
              property: 'P1545',
              snaktype: 'value',
              datavalue: { type: 'string', value: '17' }
            }
          ],
          P1416: [
            {
              property: 'P1416',
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
          property: 'P369',
          snaktype: 'value',
          datavalue: {
            type: 'wikibase-entityid',
            value: { 'entity-type': 'item', 'numeric-id': 2622002 }
          }
        },
        qualifiers: {
          P580: [
            {
              property: 'P580',
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
          P1106: [
            {
              property: 'P1106',
              snaktype: 'value',
              datavalue: {
                type: 'quantity',
                value: { amount: '+9001', unit: 'http://www.wikidata.org/entity/Q7727' }
              }
            }
          ],
          P1476: [
            {
              property: 'P1476',
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
    done()
  })

  it('should format an entity with rich qualifier', done => {
    const qualifiers = {
      P2109: [ { value: { amount: 100, unit: 'Q6982035' } } ]
    }
    const { data } = editEntity({
      id,
      claims: {
        P516: [ { value: 'Q54173', qualifiers } ]
      }
    }, properties)
    JSON.parse(data.data).claims.P516[0].qualifiers.P2109[0].should.deepEqual({
      property: 'P2109',
      snaktype: 'value',
      datavalue: {
        type: 'quantity',
        value: {
          amount: '+100',
          unit: 'http://www.wikidata.org/entity/Q6982035'
        }
      }
    })
    done()
  })

  it('should format an entity with a qualifier with a special snaktype', done => {
    const qualifiers = {
      P571: { snaktype: 'somevalue' }
    }
    const { data } = editEntity({
      id,
      claims: {
        P516: [ { value: 'Q54173', qualifiers } ]
      }
    }, properties)
    JSON.parse(data.data).claims.P516[0].qualifiers.P571[0].should.deepEqual({
      property: 'P571',
      snaktype: 'somevalue'
    })
    done()
  })

  it('should format an entity with a time qualifier', done => {
    const qualifiers = {
      P571: { value: '2019-04-01T00:00:00.000Z' }
    }
    const { data } = editEntity({
      id,
      claims: {
        P516: [ { value: 'Q54173', qualifiers } ]
      }
    }, properties)
    JSON.parse(data.data).claims.P516[0].qualifiers.P571[0].should.deepEqual({
      property: 'P571',
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
    done()
  })

  it('should format an entity with a reference', done => {
    const reference = {
      P855: 'https://example.org',
      P143: 'Q8447'
    }
    const { data } = editEntity({
      id,
      claims: {
        P369: { value: 'Q2622002', references: reference }
      }
    }, properties)
    JSON.parse(data.data).claims.P369[0].references[0].snaks.should.deepEqual([
      {
        property: 'P855',
        snaktype: 'value',
        datavalue: { type: 'string', value: 'https://example.org' }
      },
      {
        property: 'P143',
        snaktype: 'value',
        datavalue: {
          type: 'wikibase-entityid',
          value: { 'entity-type': 'item', 'numeric-id': 8447 }
        }
      }
    ])
    done()
  })

  it('should format an entity with a reference formatted with a snaks object', done => {
    const reference = {
      snaks: {
        P855: 'https://example.org',
        P143: 'Q8447'
      }
    }
    const { data } = editEntity({
      id,
      claims: {
        P369: { value: 'Q2622002', references: [ reference ] }
      }
    }, properties)
    JSON.parse(data.data).claims.P369[0].references[0].snaks[0]
    .datavalue.value.should.equal('https://example.org')
    done()
  })

  // xit('should format an entity with multiple references', done => {
  //   editEntity({
  //     id,
  //     claims: {
  //       P369: [
  //         {
  //           value: 'Q2622002',
  //           references: [
  //             { P855: 'https://example.org', P143: 'Q8447' },
  //             { P855: 'https://example2.org', P143: 'Q8447' }
  //           ]
  //         }
  //       ]
  //     }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     const lastClaim = res.entity.claims.P369.slice(-1)[0]
  //     const urlRef = lastClaim.references[0].snaks.P855[0]
  //     urlRef.datavalue.value.should.equal('https://example.org')
  //     done()
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity with a monolingual text claim', done => {
  //   editEntity({
  //     id,
  //     claims: { P1705: { text: 'Lundeborg', 'language': 'mul' } }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     done()
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity with a quantity claim', done => {
  //   editEntity({
  //     id,
  //     claims: { P1106: { amount: 9001, unit: 'Q7727' } }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     done()
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity with a rich value and qualifiers', done => {
  //   editEntity({
  //     id,
  //     claims: {
  //       P1106: {
  //         value: { amount: 9002, unit: 'Q7727' },
  //         qualifiers: { P580: '1789-08-04' }
  //       }
  //     }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     done()
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity with a globe coordinate claim', done => {
  //   editEntity({
  //     id,
  //     claims: { P626: { latitude: 45.758, longitude: 4.84138, precision: 1 / 360 } }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     done()
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity with special snaktypes', done => {
  //   editEntity({
  //     id,
  //     claims: {
  //       P369: { snaktype: 'somevalue' },
  //       P626: { snaktype: 'novalue' }
  //     }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     res.entity.claims.P369.slice(-1)[0].mainsnak.snaktype.should.equal('somevalue')
  //     res.entity.claims.P626.slice(-1)[0].mainsnak.snaktype.should.equal('novalue')
  //     done()
  //   })
  //   .catch(done)
  // })

  // xit('should format an entity with special rank', done => {
  //   editEntity({
  //     id,
  //     claims: {
  //       P369: { rank: 'deprecated', snaktype: 'somevalue' },
  //       P626: { rank: 'deprecated', latitude: 0.1, longitude: 0.1, precision: 1 / 360 },
  //       P6089: { rank: 'preferred', value: 123 }
  //     }
  //   })
  //   .then(res => {
  //     res.success.should.equal(1)
  //     res.entity.claims.P369.slice(-1)[0].rank.should.equal('deprecated')
  //     res.entity.claims.P369.slice(-1)[0].mainsnak.snaktype.should.equal('somevalue')
  //     res.entity.claims.P626.slice(-1)[0].rank.should.equal('deprecated')
  //     res.entity.claims.P626.slice(-1)[0].mainsnak.datavalue.value.latitude.should.equal(0.1)
  //     res.entity.claims.P626.slice(-1)[0].mainsnak.datavalue.value.longitude.should.equal(0.1)
  //     res.entity.claims.P626.slice(-1)[0].mainsnak.datavalue.value.precision.should.equal(0.0027777777777778)
  //     res.entity.claims.P6089.slice(-1)[0].rank.should.equal('preferred')
  //     res.entity.claims.P6089.slice(-1)[0].mainsnak.datavalue.value.amount.should.equal('+123')
  //     done()
  //   })
  //   .catch(done)
  // })

  // xit('should be able to remove a claim', done => {
  //   editEntity({
  //     id,
  //     claims: { P369: sandboxEntity }
  //   })
  //   .then(res => {
  //     const guid = res.entity.claims.P369.slice(-1)[0].id
  //     return editEntity({
  //       id,
  //       claims: { P369: { id: guid, remove: true } }
  //     })
  //     .then(res => {
  //       res.success.should.equal(1)
  //       const propClaims = res.entity.claims.P369
  //       if (propClaims) {
  //         const guids = propClaims.map(claim => claim.id)
  //         guids.includes(guid).should.be.false()
  //       }
  //       done()
  //     })
  //   })
  //   .catch(done)
  // })

  // xit('should be able to remove a label, description, or alias', done => {
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
  //       done()
  //     })
  //   })
  //   .catch(done)
  // })

  // xit('should be able to add and remove a sitelink', done => {
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
  //       done()
  //     })
  //   })
  //   .catch(done)
  // })

  // xit('should edit the existing claim when passed an id', done => {
  //   editEntity({
  //     id,
  //     claims: { P370: 'ABC' }
  //   })
  //   .then(res => {
  //     const claim = res.entity.claims.P370.slice(-1)[0]
  //     return editEntity({
  //       id,
  //       claims: { P370: { id: claim.id, value: 'DEF', rank: 'preferred' } }
  //     })
  //     .then(res => {
  //       const updatedClaim = res.entity.claims.P370.find(propClaim => propClaim.id === claim.id)
  //       console.log('updatedClaim', updatedClaim)
  //       updatedClaim.mainsnak.datavalue.value.should.equal('DEF')
  //       updatedClaim.rank.should.equal('preferred')
  //       done()
  //     })
  //   })
  //   .catch(done)
  // })
})
