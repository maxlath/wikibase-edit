import { isEntityId } from 'wikibase-sdk'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { forceArray } from '../utils.js'
import * as format from './format.js'
import { isIdAliasPattern, resolveIdAlias } from './id_alias.js'

export default async (data, properties, instance, config) => {
  validateParameters(data)

  let { id } = data
  const { create, type, datatype, clear, rawMode, reconciliation } = data
  const params = { data: {} }
  let existingClaims

  if (type && type !== 'property' && type !== 'item') {
    throw newError('invalid entity type', { type })
  }

  const statements = data.claims || data.statements

  if (create) {
    if (type === 'property') {
      if (!datatype) throw newError('missing property datatype', { datatype })
      if (!datatypes.has(datatype)) {
        throw newError('invalid property datatype', { datatype, knownDatatypes: datatypes })
      }
      params.new = 'property'
      params.data.datatype = datatype
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
    if (hasReconciliationSettings(reconciliation, statements)) {
      existingClaims = await getEntityClaims(id, config)
    }
  } else {
    throw newError('invalid entity id', { id })
  }

  const { labels, aliases, descriptions, sitelinks } = data

  if (rawMode) {
    if (labels) params.data.labels = labels
    if (aliases) params.data.aliases = aliases
    if (descriptions) params.data.descriptions = descriptions
    if (statements) params.data.claims = statements
    if (sitelinks) params.data.sitelinks = sitelinks
  } else {
    if (labels) params.data.labels = format.values('label', labels)
    if (aliases) params.data.aliases = format.values('alias', aliases)
    if (descriptions) params.data.descriptions = format.values('description', descriptions)
    if (statements) params.data.claims = format.claims(statements, properties, instance, reconciliation, existingClaims)
    if (sitelinks) params.data.sitelinks = format.sitelinks(sitelinks)
  }

  if (clear === true) params.clear = true

  if (!clear && Object.keys(params.data).length === 0) {
    throw newError('no data was passed', { id })
  }

  // stringify as it will be passed as form data
  params.data = JSON.stringify(params.data)

  return {
    action: 'wbeditentity',
    data: params,
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

const validateParameters = data => {
  for (const parameter in data) {
    if (!allowedParameters.has(parameter)) {
      throw newError(`invalid parameter: ${parameter}`, 400, { parameter, allowedParameters, data })
    }
  }
}

const hasReconciliationSettings = (reconciliation, claims) => {
  if (reconciliation != null) return true
  for (const property in claims) {
    for (const claim of forceArray(claims[property])) {
      if (claim.reconciliation != null) return true
    }
  }
  return false
}
