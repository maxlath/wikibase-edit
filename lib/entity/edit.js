const { isEntityId } = require('wikibase-sdk')
const error_ = require('../error')
const _ = require('../utils')
const format = require('./format')

module.exports = (data, properties) => {
  const { id, create, type, datatype, clear } = data
  const params = { data: {} }

  if (type && type !== 'property' && type !== 'item') {
    throw error_.new('invalid entity type', { type })
  }

  if (create) {
    if (type === 'property') {
      if (!datatype) throw error_.new('missing property datatype', { datatype })
      params.new = 'property'
      params.data.datatype = datatype
    } else {
      if (datatype) {
        throw error_.new("an item can't have a datatype", { datatype })
      }
      params.new = 'item'
    }
  } else if (isEntityId(id)) {
    params.id = id
  } else {
    throw error_.new('invalid entity id', { id })
  }

  const { labels, aliases, descriptions, claims, sitelinks, summary } = data

  if (_.isNonEmptyString(summary)) params.summary = summary

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
    params.data.claims = format.claims(claims, properties)
  }
  if (sitelinks) {
    params.data.sitelinks = format.sitelinks(sitelinks)
  }

  if (clear === true) params.clear = true

  if (!clear && Object.keys(params.data).length === 0) {
    throw error_.new('no data was passed', { id })
  }

  // stringify as it will be passed as form data
  params.data = JSON.stringify(params.data)

  return {
    action: 'wbeditentity',
    data: params
  }
}
