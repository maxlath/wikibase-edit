import config from 'config'
import wbkFactory, { type Claim, type Entity, type Guid, type Item, type Datatype, type EntityWithClaims, type ItemId } from 'wikibase-sdk'
import { customFetch } from '#lib/request/fetch'
import type { AbsoluteUrl } from '#lib/types/common'
import type { SimplifiedEditableEntity } from '#lib/types/edit_entity'
import { objectValues } from '#lib/utils'
import type { addClaim as addClaimT } from '#tests/integration/utils/sandbox_snaks'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import { getProperty } from './get_property.js'

const wbk = wbkFactory({ instance: config.instance })
const { getEntityIdFromGuid } = wbk
const wbEdit = WBEdit(config)

// Working around the circular dependency
let addClaim: typeof addClaimT
async function lateRequire () {
  ({ addClaim } = await import('#tests/integration/utils/sandbox_snaks'))
}
setTimeout(lateRequire, 0)

async function createEntity (data: Partial<SimplifiedEditableEntity> = {}) {
  // @ts-expect-error
  data.labels = data.labels || { en: randomString() }
  const { entity } = await wbEdit.entity.create(data)
  // @ts-expect-error
  console.log(`created ${entity.type}`, entity.id, data.datatype || '')
  return entity
}

let sandboxItemPromise: Promise<Item>
export function getSandboxItem () {
  sandboxItemPromise ??= (createEntity() as Promise<Item>)
  return sandboxItemPromise
}

export async function getRefreshedEntity <T extends Entity = Item> (id: T['id']) {
  const url = wbk.getEntities({ ids: id }) as AbsoluteUrl
  const res = await customFetch(url).then(res => res.json())
  return res.entities[id] as T
}

let claimPromise: Promise<Claim>
export function getSandboxClaim (datatype: Datatype = 'string') {
  claimPromise ??= _getSandboxClaim(datatype)
  return claimPromise
}

async function _getSandboxClaim (datatype: Datatype) {
  const [ item, propertyId ] = await Promise.all([
    getSandboxItem(),
    getSandboxPropertyId(datatype),
  ])
  const propertyClaims = item.claims[propertyId]
  if (propertyClaims) return propertyClaims[0]
  const res = await wbEdit.claim.create({ id: item.id, property: propertyId, value: randomString() })
  return res.claim as Claim & { id: Guid<ItemId> }
}

export async function getRefreshedClaim (guid: Guid) {
  const id = getEntityIdFromGuid(guid)
  const entity: EntityWithClaims = await getRefreshedEntity(id)
  if ('claims' in entity) {
    const { claims } = entity
    for (const propertyClaims of objectValues(claims)) {
      for (const claim of propertyClaims) {
        if (claim.id === guid) return claim
      }
    }
  }
  throw new Error(`claim not found: ${guid}`)
}

export async function getSandboxItemId () {
  const item = await getSandboxItem()
  return item.id
}

export async function getSandboxPropertyId (datatype: Datatype) {
  const property = await getProperty({ datatype })
  return property.id
}

export async function getSandboxClaimId () {
  const claim = await getSandboxClaim()
  return claim.id
}

export async function createItem (data = {}) {
  const entity = await createEntity({ ...data, type: 'item' })
  return entity as Item
}

let someEntityIdPromise: Promise<ItemId>
export async function getSomeItemId () {
  someEntityIdPromise ??= getSandboxItemId()
  return someEntityIdPromise
}

let someGuid: Guid<ItemId>
export async function getSomeGuid () {
  if (someGuid) return someGuid
  const { guid } = await addClaim({ datatype: 'string', value: randomString() })
  someGuid = guid
  return guid
}

export const getReservedItem = createItem
export const getReservedItemId = () => createItem().then(entity => entity.id)
