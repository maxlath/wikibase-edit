let isNode
try {
  isNode = process.versions.node != null
} catch (err) {
  isNode = false
}

let agent

if (isNode) {
  // Using a custom agent to set keepAlive=true
  // https://nodejs.org/api/http.html#http_class_http_agent
  // https://github.com/bitinn/node-fetch#custom-agent
  const http = await import('node:http')
  const https = await import('node:https')
  const httpAgent = new http.Agent({ keepAlive: true })
  const httpsAgent = new https.Agent({ keepAlive: true })
  agent = ({ protocol }) => protocol === 'http:' ? httpAgent : httpsAgent
}

export default (url, options = {}) => {
  options.agent = options.agent || agent
  return fetch(url, options)
}
