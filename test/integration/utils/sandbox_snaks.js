const config = require('config')
const { __ } = config
const wbEdit = __.require('.')(config)
const { getSandboxItemId, getSandboxPropertyId, getSandboxClaimId } = require('./sandbox_entities')

const addClaim = async (datatype, value) => {
  const [ id, property ] = await Promise.all([
    getSandboxItemId(),
    getSandboxPropertyId(datatype)
  ])
  const res = await wbEdit.claim.create({ id, property, value })
  return { id, property, guid: res.claim.id }
}

const addQualifier = async (datatype, value) => {
  const [ guid, property ] = await Promise.all([
    getSandboxClaimId(),
    getSandboxPropertyId(datatype)
  ])
  const res = await wbEdit.qualifier.set({ guid, property, value })
  const qualifier = res.claim.qualifiers[property].slice(-1)[0]
  return { guid, property, qualifier }
}

const addReference = async (datatype, value) => {
  const [ guid, property ] = await Promise.all([
    getSandboxClaimId(),
    getSandboxPropertyId('string')
  ])
  const { reference } = await wbEdit.reference.set({ guid, property, value })
  const referenceSnak = reference.snaks[property].slice(-1)[0]
  return { guid, property, reference, referenceSnak }
}

module.exports = { addClaim, addQualifier, addReference }
