import config from 'config'
import WBEdit from '../../../src/lib/index.js'
import { assert, randomString } from '../../unit/utils.js'
import { getSandboxItemId, getSandboxPropertyId, getSandboxClaimId } from './sandbox_entities.js'
import type { EditEntitySimplifiedModeParams } from '../../../src/lib/entity/edit.js'
import type { SetQualifierParams } from '../../../src/lib/qualifier/set.js'
import type { SetReferenceParams } from '../../../src/lib/reference/set.js'
import type { SimplifiedEditableClaim, SimplifiedEditableQualifiers } from '../../../src/lib/types/edit_entity.js'
import type { Datatype, Guid, ItemId, PropertyId } from 'wikibase-sdk'

const wbEdit = WBEdit(config)

interface AddClaimParams {
  id?: ItemId
  property?: PropertyId
  datatype?: Datatype
  value?: SimplifiedEditableClaim
  qualifiers?: SimplifiedEditableQualifiers
}

export async function addClaim (params: AddClaimParams = {}) {
  let { id, property, datatype = 'string', value = randomString(), qualifiers } = params
  id ??= await getSandboxItemId()
  property ??= (await getSandboxPropertyId(datatype))
  const res = await wbEdit.entity.edit({
    id,
    claims: {
      [property]: {
        value,
        qualifiers,
      },
    },
  } as EditEntitySimplifiedModeParams)
  assert('claims' in res.entity)
  const claim = res.entity.claims[property].slice(-1)[0]
  return { id, property, claim, guid: claim.id as Guid<ItemId> }
}

interface AddQualifierParams extends Partial<Pick<SetQualifierParams, 'property' | 'value'>> {
  guid?: Guid<ItemId>
  datatype?: Datatype
}

export async function addQualifier ({ guid, property, datatype, value }: AddQualifierParams) {
  guid ??= (await getSandboxClaimId()) as Guid<ItemId>
  property ??= await getSandboxPropertyId(datatype)
  const res = await wbEdit.qualifier.set({ guid, property, value })
  const qualifier = res.claim.qualifiers[property].slice(-1)[0]
  const { hash } = qualifier
  return { guid, property, qualifier, hash }
}

interface AddReferenceParams extends Partial<Pick<SetReferenceParams, 'property' | 'value'>> {
  guid?: Guid<ItemId>
  datatype?: Datatype
}

export async function addReference ({ guid, property, datatype, value }: AddReferenceParams) {
  guid ??= await getSandboxClaimId() as Guid<ItemId>
  property = property || (await getSandboxPropertyId(datatype))
  const { reference } = await wbEdit.reference.set({ guid, property, value })
  const referenceSnak = reference.snaks[property].slice(-1)[0]
  return { guid, property, reference, referenceSnak }
}
