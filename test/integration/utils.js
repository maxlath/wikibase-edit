const config = require('config')
const wbEdit = require('../..')(config)
const { randomString } = require('../utils')
const getSandboxProperty = require('./get_sandbox_property')

const createEntity = (data = {}) => {
  data.labels = data.labels || { en: randomString(4) }
  return wbEdit.entity.create(data)
  .then(res => {
    const { entity } = res
    console.log(`created ${entity.type}`, entity.id, data.datatype || '')
    return entity.id
  })
}

var sandboxItem
const getSandboxItem = () => sandboxItem = sandboxItem || createEntity()

// A function to quickly fail when a test gets an undesired positive answer
const undesiredRes = done => res => {
  console.warn(res, 'undesired positive res')
  done(new Error('.then function was expected not to be called'))
}

module.exports = { getSandboxItem, getSandboxProperty, undesiredRes }
