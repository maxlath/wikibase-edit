import config from 'config'
import should from 'should'
import { getSandboxItemId, getRefreshedEntity } from '#tests/integration/utils/sandbox_entities'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const wbEdit = WBEdit(config)
const language = 'fr'

describe('label set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should set a label', async () => {
    const id = await getSandboxItemId()
    const value = `Bac à Sable (${randomString()})`
    const res = await wbEdit.label.set({ id, language, value })
    res.success.should.equal(1)
    const item = await getRefreshedEntity(id)
    item.labels[language].value.should.equal(value)
  })

  it('should remove a label when passed value=null', async () => {
    const id = await getSandboxItemId()
    const value = `Bac à Sable (${randomString()})`
    await wbEdit.label.set({ id, language, value })
    const res = await wbEdit.label.set({ id, language, value: '' })
    res.success.should.equal(1)
    const item = await getRefreshedEntity(id)
    should(item.labels[language]).not.be.ok()
  })

  it('should remove a label when passed value=""', async () => {
    const id = await getSandboxItemId()
    const value = `Bac à Sable (${randomString()})`
    await wbEdit.label.set({ id, language, value })
    const res = await wbEdit.label.set({ id, language, value: '' })
    res.success.should.equal(1)
    const item = await getRefreshedEntity(id)
    should(item.labels[language]).not.be.ok()
  })
})
