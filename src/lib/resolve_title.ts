// A module that turns entity ids into full mediawiki page titles, by checking
// the Wikibase custom namespace configuration
// ex: P1 => Property:P1, Q1 => Q1 OR Item:Q1

import { isEntityId, type EntityId, type EntityPageTitle } from 'wikibase-sdk'
import { newError } from './error.js'
import { getJson } from './request/get_json.js'
import type { AbsoluteUrl } from './types/common.js'

let prefixesMapPromise

export async function resolveTitle (title: EntityId, instanceApiEndpoint: AbsoluteUrl) {
  if (!isEntityId(title)) throw newError('expected entity id as title')
  prefixesMapPromise = prefixesMapPromise || getPrefixesMap(instanceApiEndpoint)
  const prefixesMap = await prefixesMapPromise
  const idFirstLetter = title[0]
  const prefix = prefixesMap[idFirstLetter]
  return (prefix === '' ? title : `${prefix}:${title}`) as EntityPageTitle
}

async function getPrefixesMap (instanceApiEndpoint: AbsoluteUrl) {
  const infoUrl = `${instanceApiEndpoint}?action=query&meta=siteinfo&siprop=namespaces&format=json` as AbsoluteUrl
  const res = await getJson(infoUrl)
  return parsePrefixesMap(res)
}

interface Namespace {
  defaultcontentmodel: string
  '*': string
}

interface NamespacesResponse {
  query: {
    namespaces: Namespace[]
  }
}

function parsePrefixesMap (res: NamespacesResponse) {
  return Object.values(res.query.namespaces)
  .filter(namespace => namespace.defaultcontentmodel)
  .filter(namespace => namespace.defaultcontentmodel.startsWith('wikibase'))
  .reduce(aggregatePrefixes, {})
}

function aggregatePrefixes (prefixesMap: Record<string, string>, namespace: Namespace) {
  const { defaultcontentmodel, '*': prefix } = namespace
  const type = defaultcontentmodel.split('-')[1]
  const firstLetter = type === 'item' ? 'Q' : type[0].toUpperCase()
  prefixesMap[firstLetter] = prefix
  return prefixesMap
}
