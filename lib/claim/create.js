const error_ = require('../error')

module.exports = async (params, config, API) => {
  const { id, property, value, qualifiers, references, rank } = params
  const { summary } = config

  if (!value) throw error_.new('missing value', 400, params)

  const claim = { rank, qualifiers, references }
  if (value.snaktype && value.snaktype !== 'value') {
    claim.snaktype = value.snaktype
  } else {
    claim.value = value
  }

  const data = {
    id,
    claims: {
      [property]: claim
    },
    // Using wbeditentity, as the endpoint is more complete, so we need to recover the summary
    summary: summary || `add ${property} claim: ${value}`
  }

  const { entity, success } = await API.entity.edit(data, config)

  const newClaim = entity.claims[property].slice(-1)[0]
  // Mimick claim actions responses
  return { claim: newClaim, success }
}
