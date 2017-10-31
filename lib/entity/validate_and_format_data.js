const wdk = require('wikidata-sdk')
const error_ = require('../error')
const _ = require('../utils')
const format = require('./format')

module.exports = data => {
  const params = {}
  const { id, labels, aliases, descriptions, claims, sitelinks, summary } = data

  if (id === 'create') {
    params['new'] = 'item'
  } else if (wdk.isEntityId(id)) {
    params.id = id
  } else {
    throw error_.new('invalid entity id', 400, id)
  }

  if (_.isNonEmptyString(summary)) params.summary = summary

  params.data = {}
  if (labels) {
    params.data.labels = format.values('label', labels)
  }
  if (aliases) {
    params.data.aliases = format.values('alias', aliases)
  }
  if (descriptions) {
    params.data.descriptions = format.values('description', descriptions)
  }
  if (claims) {
    params.data.claims = format.claims(claims)
  }
  if (sitelinks) {
    params.data.sitelinks = format.sitelinks(sitelinks)
  }

  if (Object.keys(params.data).length === 0) {
    throw error_.new('no data was passed', 400, id)
  }

  // stringify as it will be passed as form data
  params.data = JSON.stringify(params.data)

  return params
}
