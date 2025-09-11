import * as format from '../entity/format.js'
import error_ from '../error.js'
import { getEntitySitelinks } from '../get_entity.js'
import { uniq } from '../utils.js'
import * as validate from '../validate.js'

export default async (params, config, API) => {
  let { id, site, badges } = params
  validate.entity(id)
  validate.site(site)
  badges = format.badges(badges)

  const sitelinks = await getEntitySitelinks(id, config)
  const siteObj = sitelinks[site]

  if (!siteObj) {
    throw error_.new('sitelink does not exist', 400, params)
  }

  const { title, badges: currentBadges } = siteObj
  return API.sitelink.set({
    id,
    site,
    title,
    badges: uniq(currentBadges.concat(badges)),
  })
}
