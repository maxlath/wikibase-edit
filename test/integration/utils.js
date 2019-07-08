const config = require('config')
const wbEdit = require('../..')(config)
const { randomString } = require('../utils')

const createProperty = (datatype = 'string') => {
  return wbEdit.entity.create(config, {
    type: 'property',
    datatype,
    labels: { en: randomString(4) }
  })
  .then(res => {
    console.log('res', res)
    return res.entity.id
  })
}

module.exports = { createProperty }
