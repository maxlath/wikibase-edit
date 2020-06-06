const error_ = require('../error')
const moveClaim = require('./move_claim')
const movePropertyClaims = require('./move_property_claims')

module.exports = async (params, config, API) => {
  const { guid, propertyClaimsId } = params

  if (guid) return moveClaim(params, config, API)
  else if (propertyClaimsId) return movePropertyClaims(params, config, API)
  else throw error_.new('missing claim guid or property claims id', 400, params)
}
