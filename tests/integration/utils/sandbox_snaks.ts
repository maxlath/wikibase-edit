import config from 'config'
import { randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import { getSandboxItemId, getSandboxPropertyId, getSandboxClaimId } from './sandbox_entities.js'

const wbEdit = WBEdit(config)

export const addClaim = async (params = {}) => {
  let { id, property, datatype = 'string', value = randomString(), qualifiers } = params
  id = id || (await getSandboxItemId())
  property = property || (await getSandboxPropertyId(datatype))
  const res = await wbEdit.entity.edit({
    id,
    claims: {
      [property]: {
        value,
        qualifiers,
      },
    },
  })
  const claim = res.entity.claims[property].slice(-1)[0]
  return { id, property, claim, guid: claim.id }
}

export const addQualifier = async ({ guid, property, datatype, value }) => {
  guid = guid || (await getSandboxClaimId())
  property = property || (await getSandboxPropertyId(datatype))
  const res = await wbEdit.qualifier.set({ guid, property, value })
  const qualifier = res.claim.qualifiers[property].slice(-1)[0]
  const { hash } = qualifier
  return { guid, property, qualifier, hash }
}

export const addReference = async ({ guid, property, datatype, value }) => {
  guid = guid || (await getSandboxClaimId())
  property = property || (await getSandboxPropertyId(datatype))
  const { reference } = await wbEdit.reference.set({ guid, property, value })
  const referenceSnak = reference.snaks[property].slice(-1)[0]
  return { guid, property, reference, referenceSnak }
}
