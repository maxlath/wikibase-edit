require('module-alias/register')
require('should')
const config = require('config')
const { wdCredentials: credentials } = config
const WBEdit = require('root')
const { getLastRevision } = require('./utils/utils')
const { randomString } = require('../unit/utils')
const sandboxEntityId = 'Q4115189'
const instance = 'https://www.wikidata.org'

describe('tags', function () {
  this.timeout(20 * 1000)

  // Tests disable by default as they need wikidata credentials to be set
  describe('on wikidata.org', () => {
    xit('should add a wikibase-edit tag by default', async () => {
      if (credentials == null) throw new Error('wikidata credentials required for this test (config.wdCredentials)')
      const wbEdit = WBEdit({ instance, credentials })
      const res = await wbEdit.alias.add({ id: sandboxEntityId, language: 'fr', value: randomString() })
      res.success.should.equal(1)
      const revision = await getLastRevision(sandboxEntityId, instance)
      revision.tags.should.deepEqual([ 'WikibaseJS-edit' ])
    })
  })
})
