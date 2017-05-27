// action=wbsetclaim
// format=json
// claim={"type":"statement","mainsnak":{"snaktype":"value","property":"P212","datavalue":{"type":"string","value":"978-4-15-209093-5"}},"id":"Q581426$057AC673-D7EE-4F9B-8087-C737B05DF872","references":[{"snaks":{"P143":[{"snaktype":"value","property":"P143","datavalue":{"type":"wikibase-entityid","value":{"id":"Q177837"}}}]},"snaks-order":["P143"],"hash":"a29a646602abf65105ed0f39a44231c962ece9ee"}],"rank":"normal"}
// baserevid=452835233
// bot=1
// token=edb17008346093d6aeca2e44c74405b15926f468+\

module.exports = (config) => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return (claim) => post('wbsetclaim', { claim: JSON.stringify(claim), format: 'json' })
  .then(Log(`set claim res (${claim.id})`))
  .catch(LogError(`set claim err (${claim.id})`))
}
