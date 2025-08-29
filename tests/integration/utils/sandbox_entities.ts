import config from 'config'
import wbkFactory, { type DataType, type EntityId, type Guid, type SimplifiedEntity } from 'wikibase-sdk'
import { customFetch } from '#lib/request/fetch'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import { objectValues } from '../../../src/lib/utils.js'
import { getProperty } from './get_property.js'

const wbk = wbkFactory({ instance: config.instance })
const { getEntityIdFromGuid } = wbk
const wbEdit = WBEdit(config)

// Working around the circular dependency
let addClaim
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

let sandboxItemPromise
export function getSandboxItem () {
  sandboxItemPromise = sandboxItemPromise || createEntity()
  return sandboxItemPromise
}

export async function getRefreshedEntity (id: EntityId) {
  const url = wbk.getEntities({ ids: id })
  const res = await customFetch(url).then(res => res.json())
  return res.entities[id]
}

let claimPromise
export function getSandboxClaim (datatype = 'string') {
  if (claimPromise) return claimPromise

  claimPromise = Promise.all([
    getSandboxItem(),
    getSandboxPropertyId(datatype),
  ])
  .then(([ item, propertyId ]) => {
    const propertyClaims = item.claims[propertyId]
    if (propertyClaims) return propertyClaims[0]
    return wbEdit.claim.create({ id: item.id, property: propertyId, value: randomString() })
    .then(res => res.claim)
  })

  return claimPromise
}

export async function getRefreshedClaim (guid: Guid) {
  const id = getEntityIdFromGuid(guid)
  const { claims } = await getRefreshedEntity(id)
  for (const propertyClaims of objectValues(claims)) {
    for (const claim of propertyClaims) {
      if (claim.id === guid) return claim
    }
  }
}

export const getSandboxItemId = () => getSandboxItem().then(getId)

export function getSandboxPropertyId (datatype: DataType) {
  return getProperty({ datatype }).then(getId)
}

export const getSandboxClaimId = () => getSandboxClaim().then(getId)
const getId = obj => obj.id

export function createItem (data = {}) {
  data.type = 'item'
  return createEntity(data)
}

let someEntityId
export async function getSomeEntityId () {
  someEntityId = someEntityId || (await getSandboxItemId())
  return someEntityId
}

let someGuid
export async function getSomeGuid () {
  if (someGuid) return someGuid
  const { guid } = await addClaim({ datatype: 'string', value: randomString() })
  someGuid = guid
  return guid
}

export const getReservedItem = createItem
export const getReservedItemId = () => createItem().then(entity => entity.id)
