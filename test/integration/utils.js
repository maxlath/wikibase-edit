const config = require('config')
const wbEdit = require('../..')(config)
const { randomString } = require('../utils')

const createEntity = (data = {}) => {
  data.labels = data.labels || { en: randomString(4) }
  return wbEdit.entity.create(config, data)
  .then(res => {
    const { entity } = res
    console.log(`created ${entity.type}`, entity.id, data.datatype || '')
    return entity.id
  })
}

const properties = {}

const getPropertyByDatatype = datatype => {
  properties[datatype] = properties[datatype] || createEntity({ type: 'property', datatype })
  return properties[datatype]
}

var sandboxItem
const getSandboxItem = () => sandboxItem = sandboxItem || createEntity()

module.exports = { getPropertyByDatatype, getSandboxItem }
