const findPropertyDataType = require('../properties/find_datatype')
const snaktype = 'value'
const snakBase = (property, datavalue) => ({ snaktype, property, datavalue })

const builders = {
  generic: (property, value) => {
    return snakBase(property, { type: findPropertyDataType(property), value })
  },
  entity: (property, id) => {
    const type = id[0] === 'Q' ? 'item' : 'property'
    return snakBase(property, {
      type: 'wikibase-entityid',
      value: {
        'entity-type': type,
        'numeric-id': id
      }
    })
  }
}

module.exports = {
  build: (property, value) => {
    const fnName = findPropertyDataType(property) === 'entity' ? 'entity' : 'generic'
    return builders[fnName](property, value)
  }
}
