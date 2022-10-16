const should = require('should')
const config = require('config')
const wbEdit = require('root')(config)
const { randomString } = require('tests/unit/utils')
const { getSandboxItemId, getRefreshedEntity } = require('tests/integration/utils/sandbox_entities')
const language = 'fr'

describe('description set', function () {
  this.timeout(20 * 1000)
  before('wait for instance', require('tests/integration/utils/wait_for_instance'))

  it('should set a description', async () => {
    const id = await getSandboxItemId()
    const value = `Bac à Sable (${randomString()})`
    const res = await wbEdit.description.set({ id, language, value })
    res.success.should.equal(1)
    const item = await getRefreshedEntity(id)
    item.descriptions[language].value.should.equal(value)
  })

  it('should remove a description when passed value=null', async () => {
    const id = await getSandboxItemId()
    const value = `Bac à Sable (${randomString()})`
    await wbEdit.description.set({ id, language, value })
    const res = await wbEdit.description.set({ id, language, value: null })
    res.success.should.equal(1)
    const item = await getRefreshedEntity(id)
    should(item.descriptions[language]).not.be.ok()
  })

  it('should remove a description when passed value=""', async () => {
    const id = await getSandboxItemId()
    const value = `Bac à Sable (${randomString()})`
    await wbEdit.description.set({ id, language, value })
    const res = await wbEdit.description.set({ id, language, value: '' })
    res.success.should.equal(1)
    const item = await getRefreshedEntity(id)
    should(item.descriptions[language]).not.be.ok()
  })
})
