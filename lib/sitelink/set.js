// Doc https://www.wikidata.org/w/api.php?action=help&modules=wbsetsitelink
const validate = require('../validate')

module.exports = ({ id, site, title, badges }) => {
  validate.entity(id)
  validate.site(site)
  validate.siteTitle(title)

  const params = {
    action: 'wbsetsitelink',
    data: {
      id,
      linksite: site,
      linktitle: title,
    }
  }

  // Allow to pass null to delete a sitelink
  if (title === null) {
    delete params.data.linktitle
  }

  if (badges != null) {
    if (typeof badges === 'string') {
      badges = badges.split('|')
    }
    validate.badges(badges)
    params.data.badges = badges.join('|')
  }

  return params
}
