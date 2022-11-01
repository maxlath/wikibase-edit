// Doc https://www.wikidata.org/w/api.php?action=help&modules=wbsetsitelink
const validate = require('../validate')
const format = require('../entity/format')
const { getEntitySitelinks } = require('../get_entity')
const error_ = require('../error')
const { difference } = require('../utils')

module.exports = async (params, config, API) => {
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
    badges: difference(currentBadges, badges)
  })
}
