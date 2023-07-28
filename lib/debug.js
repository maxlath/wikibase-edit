const { DEBUG = '' } = (process?.env || {})
const namespace = 'wikibase-edit'
export const debugMode = DEBUG === '*' || (DEBUG.length > 0 && namespace.startsWith(DEBUG.replace(/\*$/, ''))) || DEBUG.startsWith(`${namespace}:`)
const debugSection = DEBUG.split(':').slice(1).join(':').replace(/\*$/, '')

export function debug (section, ...args) {
  if (!debugMode) return
  if (debugSection && !section.startsWith(debugSection)) return
  console.error(`${new Date().toISOString()} ${namespace}:${section}`, ...args.map(stringify))
}

function stringify (data) {
  if (typeof data === 'string') return data
  const str = JSON.stringify(data)
  if (str === '{}' || str === '[]') return ''
  else return str
}
