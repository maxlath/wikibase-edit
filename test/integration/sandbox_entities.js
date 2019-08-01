const config = require('config')
const wbEdit = require('../..')(config)
const { randomString } = require('../utils')
const getSandboxProperty = require('./get_sandbox_property')
const breq = require('bluereq')

const createEntity = (data = {}) => {
  data.labels = data.labels || { en: randomString(4) }
  console.log('data', data)
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

module.exports = {
  getSandboxItem,
  getSandboxProperty,
  getSandboxItemId: () => getSandboxItem().then(getId),
  getSandboxPropertyId: datatype => getSandboxProperty(datatype).then(getId),
  getRefreshedEntity
}
