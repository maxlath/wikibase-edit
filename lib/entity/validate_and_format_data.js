const wdk = require('wikidata-sdk')
const error_ = require('../error')
const _ = require('../utils')
const format = require('./format')

module.exports = data => {
  const params = {}
  const { id, clear, labels, aliases, descriptions, claims, sitelinks, summary, 
          type= 'item', datatype} = data

  if (id === 'create') {
    params['new'] = type
  } else {

    // validate the ID for the given type
    let validId = false;
    switch( type ) {
      case 'item': validId = wdk.isItemId(id); break
      case 'property': validId = wdk.isPropertyId(id); break
      default: throw error_.new('unknown entity type', 400, type)
    }

    // reject invalid IDs
    if( !validId ) {
      throw error_.new(`invalid id for type ${type}`, 400, id)
    }

    // store the ID
    params.id = id

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
  if (sitelinks && (type=='item')) {
    params.data.sitelinks = format.sitelinks(sitelinks)
  }
  if(datatype && (type=='property')) {
    if('id' in params) {
      throw error_.new('can not edit datatype on properties', 400, id)
    }
    params.data.datatype = '' + datatype
  }

  if (clear === true) params.clear = true

  if (!clear && Object.keys(params.data).length === 0) {
    throw error_.new('no data was passed', 400, id)
  }

  // stringify as it will be passed as form data
  params.data = JSON.stringify(params.data)

  return params
}
