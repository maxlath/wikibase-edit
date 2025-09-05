import config from 'config'
import { assert, randomString } from '#tests/unit/utils'
import WBEdit from '#root'
import { getSandboxItemId, getSandboxPropertyId, getSandboxClaimId } from './sandbox_entities.js'
import type { EditableEntity } from '../../../src/lib/types/edit_entity.js'
import type { Datatype, Guid, PropertyId, SimplifiedClaim, SimplifiedQualifier, SimplifiedQualifiers, SimplifiedReference } from 'wikibase-sdk'

const wbEdit = WBEdit(config)

interface AddClaimParams {
  id?: EditableEntity['id']
  property?: PropertyId
  datatype?: Datatype
  value?: SimplifiedClaim
  qualifiers?: SimplifiedQualifiers
}

export async function addClaim (params: AddClaimParams = {}) {
  let { id, property, datatype = 'string', value = randomString(), qualifiers } = params
  id = id || (await getSandboxItemId())
  property = property || (await getSandboxPropertyId(datatype))
  // @ts-expect-error
  const res = await wbEdit.entity.edit({
    id,
    claims: {
      [property]: {
        value,
        qualifiers,
      },
    },
  })
  assert('claims' in res.entity)
  const claim = res.entity.claims[property].slice(-1)[0]
  return { id, property, claim, guid: claim.id }
}

interface AddQualifierParams {
  guid?: Guid
  property?: PropertyId
  datatype?: Datatype
  value?: SimplifiedQualifier
}

export async function addQualifier ({ guid, property, datatype, value }: AddQualifierParams) {
  guid = guid || (await getSandboxClaimId())
  property = property || (await getSandboxPropertyId(datatype))
  const res = await wbEdit.qualifier.set({ guid, property, value })
  const qualifier = res.claim.qualifiers[property].slice(-1)[0]
  const { hash } = qualifier
  return { guid, property, qualifier, hash }
}

interface AddReferenceParams {
  guid?: Guid
  property?: PropertyId
  datatype?: Datatype
  value?: SimplifiedReference
}

export async function addReference ({ guid, property, datatype, value }: AddReferenceParams) {
  guid = guid || (await getSandboxClaimId())
  property = property || (await getSandboxPropertyId(datatype))
  const { reference } = await wbEdit.reference.set({ guid, property, value })
  const referenceSnak = reference.snaks[property].slice(-1)[0]
  return { guid, property, reference, referenceSnak }
}
