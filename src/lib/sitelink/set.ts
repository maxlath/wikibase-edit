// Doc https://www.wikidata.org/w/api.php?action=help&modules=wbsetsitelink
import * as format from '../entity/format.js'
import * as validate from '../validate.js'
import type { Entity, EntityId, SitelinkBadges } from 'wikibase-sdk'

export interface SetSitelinkParams {
  id: EntityId
  site: string
  title: string
  badges: SitelinkBadges
}

export function setSitelink ({ id, site, title, badges }) {
  validate.entity(id)
  validate.site(site)
  validate.siteTitle(title)

  const params = {
    action: 'wbsetsitelink',
    data: {
      id,
      linksite: site,
      linktitle: title,
    },
  }

  // Allow to pass null to delete a sitelink
  if (title === null) {
    delete params.data.linktitle
  }

  if (badges != null) {
    params.data.badges = format.badges(badges).join('|')
  }

  return params
}

export interface SetSitelinkResponse {
  success: 1
  entity: Entity
}
