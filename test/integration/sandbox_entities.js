const config = require('config')
const wbEdit = require('../..')(config)
const { randomString } = require('../utils')
const getSandboxProperty = require('./get_sandbox_property')
const breq = require('bluereq')

const createEntity = (data = {}) => {
  data.labels = data.labels || { en: randomString() }
  return wbEdit.entity.create(data)
  .then(res => {
    const { entity } = res
    console.log(`created ${entity.type}`, entity.id, data.datatype || '')
    return entity
  })
}

var sandboxItem
const getSandboxItem = () => sandboxItem = sandboxItem || createEntity()

const getId = entity => entity.id

const getRefreshedEntity = id => {
  const url = wbk.getEntities({ ids: id })
  return breq.get(url).then(res => res.entities[id])
}

const getSandboxItemId = () => getSandboxItem().then(getId)

const getSandboxPropertyId = datatype => getSandboxProperty(datatype).then(getId)

var claim
const getSandboxClaim = (datatype = 'string') => {
  if (claim) return Promise.resolve(claim)

  return Promise.all([
    getSandboxItem(),
    getSandboxPropertyId(datatype)
  ])
  .then(([ item, propertyId ]) => {
    const propertyClaims = item.claims[propertyId]
    if (propertyClaims) return propertyClaims[0]
    return wbEdit.claim.add({ id: item.id, property: propertyId, value: randomString() })
    .then(res => claim = res.claim)
  })
}

module.exports = {
  getSandboxItem,
  getSandboxProperty,
  getSandboxItemId,
  getSandboxPropertyId,
  getRefreshedEntity,
  getSandboxClaim
}
