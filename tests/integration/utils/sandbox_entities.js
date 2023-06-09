import config from 'config'
import wbkFactory from 'wikibase-sdk'
import fetch from '#lib/request/fetch'
import { randomString } from '#tests/unit/utils'
import getProperty from './get_property.js'
import wbEditFactory from '#root'

const wbk = wbkFactory({ instance: config.instance })
const { getEntityIdFromGuid } = wbk
const wbEdit = wbEditFactory(config)

// Working around the circular dependency
let addClaim
const lateRequire = async () => {
  ({ addClaim } = await import('tests/integration/utils/sandbox_snaks'))
}
setTimeout(lateRequire, 0)

const createEntity = async (data = {}) => {
  data.labels = data.labels || { en: randomString() }
  const { entity } = await wbEdit.entity.create(data)
  console.log(`created ${entity.type}`, entity.id, data.datatype || '')
  return entity
}

let sandboxItemPromise
export const getSandboxItem = () => {
  sandboxItemPromise = sandboxItemPromise || createEntity()
  return sandboxItemPromise
}

export const getRefreshedEntity = async id => {
  const url = wbk.getEntities({ ids: id })
  const res = await fetch(url).then(res => res.json())
  return res.entities[id]
}

let claimPromise
export const getSandboxClaim = (datatype = 'string') => {
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

export const getRefreshedClaim = async guid => {
  const id = getEntityIdFromGuid(guid)
  const { claims } = await getRefreshedEntity(id)
  for (const propertyClaims of Object.values(claims)) {
    for (const claim of propertyClaims) {
      if (claim.id === guid) return claim
    }
  }
}

export const getSandboxItemId = () => getSandboxItem().then(getId)
export const getSandboxPropertyId = datatype => getProperty({ datatype }).then(getId)
export const getSandboxClaimId = () => getSandboxClaim().then(getId)
const getId = obj => obj.id

export const createItem = (data = {}) => {
  data.type = 'item'
  return createEntity(data)
}

let someEntityId
export const getSomeEntityId = async () => {
  someEntityId = someEntityId || (await getSandboxItemId())
  return someEntityId
}

let someGuid
export const getSomeGuid = async () => {
  if (someGuid) return someGuid
  const { guid } = await addClaim({ datatype: 'string', value: randomString() })
  someGuid = guid
  return guid
}

export const getReservedItem = createItem
export const getReservedItemId = () => createItem().then(entity => entity.id)
