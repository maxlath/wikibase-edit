const getClaimPromise = () => {
  const addClaim = require('../lib/claim/add')(require('config'))
  return addClaim(fixtures.sandboxEntity, fixtures.sandboxStringProp, helpers.randomString())
}

const helpers = {
  randomString: () => Math.random().toString(36).slice(2, 10),

  randomNumber: (lenght = 2) => Math.trunc(Math.random() * Math.pow(10, lenght)),


  getClaimGuid: () => getClaimPromise().then(res => res.claim.id),
  // A function to quickly fail when a test gets an undesired positive answer

  undesiredRes: done => res => {
    console.warn(res, 'undesired positive res')
    done(new Error('.then function was expected not to be called'))
  }
}

const fixtures = {
  sandboxEntity: 'Q4115189',
  secondSandboxEntity: 'Q13406268',
  guid: 'Q4115189$3A8AA34F-0DEF-4803-AA8E-39D9EFD4DEAF',
  guid2: 'Q4115189$3A8AA34F-0DAB-4803-AA8E-39D9EFD4DEAF',
  sandboxStringProp: 'P370'
}

const properties = {
  P17: 'WikibaseItem',
  P31: 'WikibaseItem',
  P50: 'WikibaseItem',
  P143: 'WikibaseItem',
  P155: 'WikibaseItem',
  P156: 'WikibaseItem',
  P369: 'WikibaseItem',
  P370: 'String',
  P516: 'WikibaseItem',
  P571: 'Time',
  P578: 'Time',
  P580: 'Time',
  P600: 'ExternalId',
  P626: 'GlobeCoordinate',
  P854: 'Url',
  P855: 'Url',
  P1106: 'Quantity',
  P1416: 'WikibaseItem',
  P1476: 'Monolingualtext',
  P1545: 'String',
  P1705: 'Monolingualtext',
  P1775: 'WikibaseItem',
  P2078: 'Url',
  P2109: 'Quantity',
  P2130: 'Quantity',
  P2440: 'String',
  P3132: 'Monolingualtext',
  P6089: 'Quantity'
}

module.exports = Object.assign({ properties }, helpers, fixtures)
