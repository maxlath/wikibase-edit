// Doc https://www.wikidata.org/w/api.php?action=help&modules=wbsetsitelink

import * as format from '../entity/format.js'
import { newError } from '../error.js'
import { getEntitySitelinks } from '../get_entity.js'
import { difference } from '../utils.js'
import * as validate from '../validate.js'
import type { SerializedConfig } from '../types/config.js'
import type { EntityId, ItemId } from 'wikibase-sdk'

export interface RemoveBadgeParams {
  id: EntityId
  site: string
  badges: ItemId | ItemId[]
}

export async function removeBadge (params: RemoveBadgeParams, config: SerializedConfig, API) {
  let { id, site, badges } = params
  validate.entity(id)
  validate.site(site)
  badges = format.badges(badges)

  const sitelinks = await getEntitySitelinks(id, config)
  const siteObj = sitelinks[site]

  if (!siteObj) {
    throw newError('sitelink does not exist', 400, params)
  }

  const { title, badges: currentBadges } = siteObj
  return API.sitelink.set({
    id,
    site,
    title,
    badges: difference(currentBadges, badges),
  })
}
