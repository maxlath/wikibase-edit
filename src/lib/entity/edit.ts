import { omit } from 'lodash-es'
import { isEntityId, type Entity, type Item, type ItemId, type Lexeme, type LexemeId, type MediaInfo, type MediaInfoId, type Property, type PropertyId, type SimplifiedClaims, type SimplifiedEntity } from 'wikibase-sdk'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { arrayIncludes, forceArray } from '../utils.js'
import { formatClaims, formatSitelinks, formatValues } from './format.js'
import { isIdAliasPattern, resolveIdAlias } from './id_alias.js'
import type { CreateEntityResponse } from './create.js'
import type { Reconciliation } from './validate_reconciliation_object.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'

interface EditEntityParamsBase {
  id?: ItemId | PropertyId | LexemeId | MediaInfoId
  clear?: boolean
  create?: boolean
  reconciliation?: Reconciliation
}

type EditEntityRawModeParams = EditEntityParamsBase & Entity & {
  rawMode: true
}

type EditEntitySimplifiedModeParams = EditEntityParamsBase & SimplifiedEntity & {
  rawMode: false | undefined
}

export type EditEntityParams = EditEntityRawModeParams | EditEntitySimplifiedModeParams

const editableTypes = [
  // 'form',
  'item',
  'lexeme',
  'mediainfo',
  'property',
  // 'sense',
] as const

interface WbeditentityDataBase <T extends Entity> {
  type: T['type']
  new?: T['type']
  clear?: boolean
  id?: T['id']
  data: Partial<T>
}

type WbeditentityItemData = WbeditentityDataBase<Item>
type WbeditentityPropertyData = WbeditentityDataBase<Property>
type WbeditentityLexemeData = WbeditentityDataBase<Lexeme>
type WbeditentityMediaInfoData = WbeditentityDataBase<MediaInfo>
type WbeditentityData = WbeditentityItemData | WbeditentityPropertyData | WbeditentityLexemeData | WbeditentityMediaInfoData

export async function editEntity (inputParams: EditEntityParams, properties: PropertiesDatatypes, instance: AbsoluteUrl, config: SerializedConfig) {
  validateParameters(inputParams)

  let { id } = inputParams
  const { create, type = 'item', clear, rawMode, reconciliation } = inputParams
  const datatype = 'datatype' in inputParams ? inputParams.datatype : undefined

  if (!arrayIncludes(editableTypes, type)) {
    throw newError('invalid entity type', { type })
  }

  let params: Partial<WbeditentityData> = { type, data: {} }
  let existingClaims

  if (create) {
    if (type === 'property') {
      if (!datatype) throw newError('missing property datatype', { datatype })
      if (!datatypes.has(datatype)) {
        throw newError('invalid property datatype', { datatype, knownDatatypes: datatypes })
      }
      params = {
        ...params,
        new: 'property',
        data: {
          datatype,
        },
      } as WbeditentityPropertyData
    } else {
      if (datatype) {
        throw newError("an item can't have a datatype", { datatype })
      }
      params.new = 'item'
    }
  } else if (isEntityId(id) || isIdAliasPattern(id)) {
    if (isIdAliasPattern(id)) {
      id = await resolveIdAlias(id, instance)
    }
    params.id = id
    // @ts-expect-error
    if (hasReconciliationSettings(reconciliation, inputParams.claims || inputParams.statements)) {
      existingClaims = await getEntityClaims(id, config)
    }
  } else {
    throw newError('invalid entity id', { id })
  }

  // @ts-expect-error
  const { labels, aliases, descriptions, claims, statements, sitelinks } = inputParams

  if (rawMode) {
    if (params.type === 'item' || params.type === 'property') {
      if (labels) params.data.labels = labels
      if (aliases) params.data.aliases = aliases
      if (descriptions) params.data.descriptions = descriptions
      if (claims) params.data.claims = claims
    }
    if (params.type === 'mediainfo') {
      if (statements) params.data.statements = statements
    }
    if (params.type === 'item') {
      if (sitelinks) params.data.sitelinks = sitelinks
    }
  } else {
    if (params.type === 'item' || params.type === 'property') {
      if (labels) params.data.labels = formatValues('label', labels)
      if (aliases) params.data.aliases = formatValues('alias', aliases)
      if (descriptions) params.data.descriptions = formatValues('description', descriptions)
      if (claims) params.data.claims = formatClaims(claims, properties, instance, reconciliation, existingClaims)
    }
    if (params.type === 'mediainfo') {
      if (statements) params.data.statements = formatClaims(statements, properties, instance, reconciliation, existingClaims)
    }
    if (params.type === 'item') {
      if (sitelinks) params.data.sitelinks = formatSitelinks(sitelinks)
    }
  }

  if (clear === true) params.clear = true

  if (!clear && Object.keys(params.data).length === 0) {
    throw newError('no data was passed', { id })
  }

  return {
    action: 'wbeditentity',
    data: {
      ...params,
      // stringify as it will be passed as form data
      data: JSON.stringify(omit(params.data, 'type')),
    },
  }
}

const datatypes = new Set([
  'commonsMedia',
  'edtf',
  'external-id',
  'geo-shape',
  'globe-coordinate',
  // datatype from https://github.com/ProfessionalWiki/WikibaseLocalMedia
  'localMedia',
  'math',
  'monolingualtext',
  'musical-notation',
  'quantity',
  'string',
  'tabular-data',
  'time',
  'url',
  'wikibase-form',
  'wikibase-item',
  'wikibase-property',
  'wikibase-lexeme',
])

const allowedParameters = new Set([
  'id', 'create', 'type', 'datatype', 'clear', 'rawMode', 'summary', 'baserevid',
  'labels', 'aliases', 'descriptions', 'claims', 'statements', 'sitelinks', 'reconciliation',
  'origin',
])

function validateParameters (params: EditEntityParams) {
  for (const parameter in params) {
    if (!allowedParameters.has(parameter)) {
      throw newError(`invalid parameter: ${parameter}`, 400, { parameter, allowedParameters, params })
    }
  }
}

function hasReconciliationSettings (reconciliation: Reconciliation, claims: SimplifiedClaims) {
  if (reconciliation != null) return true
  for (const property in claims) {
    for (const claim of forceArray(claims[property])) {
      if (claim.reconciliation != null) return true
    }
  }
  return false
}

export type EditEntityResponse = CreateEntityResponse
