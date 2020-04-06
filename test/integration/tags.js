require('should')
const config = require('config')
const { __, wdCredentials: credentials } = config
const WBEdit = __.require('.')
const { randomString } = require('../unit/utils')
const sandboxEntityId = 'Q4115189'

describe('tags', function () {
  this.timeout(20 * 1000)

  // Tests disable by default as they need wikidata credentials to be set
  describe('on wikidata.org', () => {
    if (credentials == null) throw new Error('wikidata credentials required for this test (config.wdCredentials)')

    xit('should add a wikibase-edit tag by default', async () => {
      const wbEdit = WBEdit({ instance: 'https://www.wikidata.org', credentials })
      const res = await wbEdit.alias.add({ id: sandboxEntityId, language: 'fr', value: randomString() })
      res.tags.should.equal('wikibase-edit')
    })
  })
})
