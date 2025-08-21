import { WBK } from 'wikibase-sdk'

const wdks = {}

export default instance => {
  if (!wdks[instance]) wdks[instance] = WBK({ instance })
  return wdks[instance]
}
