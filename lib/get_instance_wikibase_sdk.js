const WDK = require('wikibase-sdk')
const wdks = {}

module.exports = instance => {
  if (!wdks[instance]) wdks[instance] = WDK({ instance })
  return wdks[instance]
}
