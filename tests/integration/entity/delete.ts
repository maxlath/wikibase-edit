import 'should'
import config from 'config'
import WBEdit from '../../../src/lib/index.js'
import { assert, randomString } from '../../unit/utils.js'
import { waitForInstance } from '../utils/wait_for_instance.js'
import type { EditEntitySimplifiedModeParams } from '../../../src/lib/entity/edit.js'
// Use credentialsAlt as the OAuth token might miss the permission to delete pages
// thus getting a 'permissiondenied' error

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
