import 'should'
import config from 'config'
import type { EditEntitySimplifiedModeParams } from '#lib/entity/edit'
import { waitForInstance } from '#tests/integration/utils/wait_for_instance'
// Use credentialsAlt as the OAuth token might miss the permission to delete pages
// thus getting a 'permissiondenied' error
import { assert, randomString } from '#tests/unit/utils'
import WBEdit from '#root'

const { instance, credentialsAlt } = config

const wbEdit = WBEdit({ instance, credentials: credentialsAlt })

describe('entity delete', function () {
  this.timeout(20 * 1000)
  before('wait for instance', waitForInstance)

  it('should delete an item', async () => {
    const resA = await wbEdit.entity.create({ labels: { en: randomString() } } as EditEntitySimplifiedModeParams)
    const { id } = resA.entity
    const resB = await wbEdit.entity.delete({ id })
    assert('delete' in resB)
    assert(typeof resB.delete === 'object')
    assert('title' in resB.delete)
    resB.delete.title.should.endWith(id)
  })

  it('should delete a property', async () => {
    const resA = await wbEdit.entity.create({
      type: 'property',
      datatype: 'string',
      labels: { en: randomString() },
    } as EditEntitySimplifiedModeParams)
    const { id } = resA.entity
    const resB = await wbEdit.entity.delete({ id })
    assert('delete' in resB)
    assert(typeof resB.delete === 'object')
    assert('title' in resB.delete)
    resB.delete.title.should.equal(`Property:${id}`)
  })
})
