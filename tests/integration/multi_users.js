require('should')
const { instance, credentialsAlt, secondUserCredentials } = require('config')
const { randomString } = require('tests/unit/utils')
const WBEdit = require('root')
const { getSandboxItemId } = require('tests/integration/utils/sandbox_entities')
const { getEntityHistory } = require('./utils/utils')

describe('multi users edits', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('tests/integration/utils/wait_for_instance'))

  it('should allow to change user at each request', async () => {
    const wbEdit = WBEdit({ instance })
    const id = await getSandboxItemId()
    await addAlias(wbEdit, id, { anonymous: true })
    await addAlias(wbEdit, id, { credentials: credentialsAlt })
    await addAlias(wbEdit, id, { credentials: secondUserCredentials })
    await addAlias(wbEdit, id, { anonymous: true })
    await addAlias(wbEdit, id, { credentials: credentialsAlt })
    const revisions = await getEntityHistory(id)
    const addAliasRevisions = revisions.slice(-5)
    addAliasRevisions[0].anon.should.equal('')
    addAliasRevisions[1].user.should.equal(credentialsAlt.username)
    addAliasRevisions[2].user.should.equal(secondUserCredentials.username)
    addAliasRevisions[3].anon.should.equal('')
    addAliasRevisions[4].user.should.equal(credentialsAlt.username)
  })
})

const addAlias = async (wbEdit, id, reqConfig) => {
  return wbEdit.alias.add({
    id,
    language: 'la',
    value: randomString()
  }, reqConfig)
}
