const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { getSandboxItemId, getSandboxPropertyId, getSandboxClaimId } = require('./sandbox_entities')

const addClaim = (datatype, value) => {
  return Promise.all([
    getSandboxItemId(),
    getSandboxPropertyId(datatype)
  ])
  .then(([ id, property ]) => {
    return wbEdit.claim.create({ id, property, value })
    .then(res => {
      return { id, property, guid: res.claim.id }
    })
  })
}

const addQualifier = (datatype, value) => {
  return Promise.all([
    getSandboxClaimId(),
    getSandboxPropertyId('string')
  ])
  .then(([ guid, property ]) => {
    return wbEdit.qualifier.set({ guid, property, value })
    .then(res => {
      const qualifier = res.claim.qualifiers[property].slice(-1)[0]
      return { guid, property, qualifier }
    })
  })
}

const addReference = (datatype, value) => {
  return Promise.all([
    getSandboxClaimId(),
    getSandboxPropertyId('string')
  ])
  .then(([ guid, property ]) => {
    return wbEdit.reference.set({ guid, property, value })
    .then(res => {
      const { reference } = res
      const referenceSnak = reference.snaks[property].slice(-1)[0]
      return { guid, property, reference, referenceSnak }
    })
  })
}

module.exports = { addClaim, addQualifier, addReference }
