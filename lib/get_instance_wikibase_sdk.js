import WDK from 'wikibase-sdk'

const wdks = {}

export default instance => {
  if (!wdks[instance]) wdks[instance] = WDK({ instance })
  return wdks[instance]
}
