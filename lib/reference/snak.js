const findPropertyDataType = require('../properties/find_datatype')
const snaktype = 'value'
const snakBase = (property, datavalue) => ({ snaktype, property, datavalue })

const builders = {
  generic: (property, value) => {
    return snakBase(property, { type: findPropertyDataType(property), value })
  },
  item: (property, id) => {
    return snakBase(property, {
      type: 'wikibase-entityid',
      value: {
        'entity-type': 'item',
        'numeric-id': id
      }
    })
  }
}

module.exports = {
  build: (property, value) => {
    const fnName = findPropertyDataType(property) === 'claim' ? 'item' : 'generic'
    return builders[fnName](property, value)
  }
}
