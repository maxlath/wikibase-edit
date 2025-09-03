import config from 'config'
import wbkFactory, { type Claim, type DataType, type Entity, type EntityId, type Guid, type Item, type Lexeme, type Property, type SimplifiedEntity } from 'wikibase-sdk'
import { customFetch } from '#lib/request/fetch'
import type { addClaim as addClaimT } from '#tests/integration/utils/sandbox_snaks'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import { objectValues } from '../../../src/lib/utils.js'
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

async function createEntity (data: Partial<SimplifiedEntity> = {}) {
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

export async function getRefreshedEntity (id: EntityId) {
  const url = wbk.getEntities({ ids: id })
  const res = await customFetch(url).then(res => res.json())
  return res.entities[id] as Entity
}

let claimPromise: Promise<Claim>
export function getSandboxClaim (datatype: DataType = 'string') {
  claimPromise ??= _getSandboxClaim(datatype)
  return claimPromise
}

async function _getSandboxClaim (datatype: DataType) {
  const [ item, propertyId ] = await Promise.all([
    getSandboxItem(),
    getSandboxPropertyId(datatype),
  ])
  const propertyClaims = item.claims[propertyId]
  if (propertyClaims) return propertyClaims[0]
  const res = await wbEdit.claim.create({ id: item.id, property: propertyId, value: randomString() })
  return res.claim
}

export async function getRefreshedClaim (guid: Guid) {
  const id = getEntityIdFromGuid(guid)
  const { claims } = (await getRefreshedEntity(id)) as EntityWithClaims
  for (const propertyClaims of objectValues(claims)) {
    for (const claim of propertyClaims) {
      if (claim.id === guid) return claim
    }
  }
  throw new Error(`claim not found: ${guid}`)
}

export async function getSandboxItemId () {
  const item = await getSandboxItem()
  return item.id
}

export async function getSandboxPropertyId (datatype: DataType) {
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

let someEntityIdPromise: Promise<EntityId>
export async function getSomeEntityId () {
  someEntityIdPromise ??= getSandboxItemId()
  return someEntityIdPromise
}

let someGuid: Guid
export async function getSomeGuid () {
  if (someGuid) return someGuid
  const { guid } = await addClaim({ datatype: 'string', value: randomString() })
  someGuid = guid
  return guid
}

export const getReservedItem = createItem
export const getReservedItemId = () => createItem().then(entity => entity.id)
