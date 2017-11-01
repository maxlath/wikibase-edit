const utils = module.exports = {
  randomString: () => Math.random().toString(36).slice(2, 10),
  randomNumber: lenght => Math.trunc(Math.random() * Math.pow(10, lenght)),
  // Sandbox entity: https://wikidata.org/wiki/Q4115189
  sandboxEntity: 'Q4115189',
  sandboxStringProp: 'P370',
  sandboxDescriptionFr: "Bac à sable pour amuser les contributeurs (laisser une description ici pour qu'on le retrouve)",
  getClaimPromise: () => {
    const addClaim = require('../lib/claim/add')(require('config'))
    return addClaim(utils.sandboxEntity, utils.sandboxStringProp, utils.randomString())
  },
  getClaimGuid: () => utils.getClaimPromise().then(res => res.claim.id)
}
