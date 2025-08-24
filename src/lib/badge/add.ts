import * as format from '../entity/format.js'
import { newError } from '../error.js'
import { getEntitySitelinks } from '../get_entity.js'
import { uniq } from '../utils.js'
import * as validate from '../validate.js'
import type { WikibaseEditAPI } from '../index.js'
import type { SetSitelinkResponse } from '../sitelink/set.js'
import type { SerializedConfig } from '../types/config.js'
import type { EntityId, ItemId } from 'wikibase-sdk'

export interface AddBadgeParams {
  id: EntityId
  site: string
  badges: ItemId | ItemId[]
}

export async function addBadge (params: AddBadgeParams, config: SerializedConfig, API: WikibaseEditAPI) {
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
    badges: uniq(currentBadges.concat(badges)),
  })
}

export type AddBadgeResponse = SetSitelinkResponse
