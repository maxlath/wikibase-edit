// Doc https://www.wikidata.org/w/api.php?action=help&modules=wbsetsitelink

import { difference } from 'lodash-es'
import { formatBadges } from '../entity/format.js'
import { newError } from '../error.js'
import { getEntitySitelinks } from '../get_entity.js'
import { validateEntityId, validateSite } from '../validate.js'
import type { WikibaseEditAPI } from '../index.js'
import type { SetSitelinkResponse } from '../sitelink/set.js'
import type { SerializedConfig } from '../types/config.js'
import type { EntityWithSitelinks, ItemId } from 'wikibase-sdk'

export interface RemoveBadgeParams {
  id: EntityWithSitelinks['id']
  site: string
  badges: ItemId | ItemId[]
}

export async function removeBadge (params: RemoveBadgeParams, config: SerializedConfig, API: WikibaseEditAPI) {
  let { id, site, badges } = params
  validateEntityId(id)
  validateSite(site)
  badges = formatBadges(badges)

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

export type RemoveBadgeResponse = SetSitelinkResponse
