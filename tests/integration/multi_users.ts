import 'should'
import config from 'config'
import WBEdit from '../../src/lib/index.js'
import { randomString } from '../unit/utils.js'
import { getSandboxItemId } from './utils/sandbox_entities.js'
import { getEntityHistory } from './utils/utils.js'
import { waitForInstance } from './utils/wait_for_instance.js'

const { instance, credentialsAlt, secondUserCredentials } = config

describe('multi users edits', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

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

async function addAlias (wbEdit, id, reqConfig) {
  return wbEdit.alias.add({
    id,
    language: 'la',
    value: randomString(),
  }, reqConfig)
}
