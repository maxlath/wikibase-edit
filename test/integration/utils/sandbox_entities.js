const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { randomString } = __.require('test/unit/utils')
const getProperty = require('./get_property')
const fetch = __.require('lib/request/fetch')

const createEntity = async (data = {}) => {
  data.labels = data.labels || { en: randomString() }
  const { entity } = await wbEdit.entity.create(data)
  console.log(`created ${entity.type}`, entity.id, data.datatype || '')
  return entity
}

var sandboxItemPromise
const getSandboxItem = () => {
  sandboxItemPromise = sandboxItemPromise || createEntity()
  return sandboxItemPromise
}

const getRefreshedEntity = async id => {
  const url = config.wbk.getEntities({ ids: id })
  const res = await fetch(url).then(res => res.json())
  return res.entities[id]
}

var claimPromise
const getSandboxClaim = (datatype = 'string') => {
  if (claimPromise) return claimPromise

  claimPromise = Promise.all([
    getSandboxItem(),
    getSandboxPropertyId(datatype)
  ])
  .then(([ item, propertyId ]) => {
    const propertyClaims = item.claims[propertyId]
    if (propertyClaims) return propertyClaims[0]
    return wbEdit.claim.create({ id: item.id, property: propertyId, value: randomString() })
    .then(res => res.claim)
  })

  return claimPromise
}

const getSandboxItemId = () => getSandboxItem().then(getId)
const getSandboxPropertyId = datatype => getProperty({ datatype }).then(getId)
const getSandboxClaimId = () => getSandboxClaim().then(getId)
const getId = obj => obj.id

const createItem = (data = {}) => {
  data.type = 'item'
  return createEntity(data)
}

module.exports = {
  getSandboxItem,
  getSandboxItemId,
  getSandboxPropertyId,
  getRefreshedEntity,
  getSandboxClaim,
  getSandboxClaimId,
  createItem
}
