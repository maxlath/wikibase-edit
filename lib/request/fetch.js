// Could be replaced by native fetch, once the NodeJS 20 is the active LTS
// as `fetch` will not be considered experimental anymore
import fetch from 'cross-fetch'
import { debug, debugMode } from '../debug.js'

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
  if (debugMode) {
    const { method = 'get', headers, body } = options
    debug('request', method.toUpperCase(), url, {
      headers: obfuscateHeaders(headers),
      body: obfuscateBody({ url, body }),
    })
  }
  return fetch(url, options)
}

function obfuscateHeaders (headers) {
  const obfuscatedHeadersEntries = Object.entries(headers).map(([ name, value ]) => [ name.toLowerCase(), value ])
  const obfuscatedHeaders = Object.fromEntries(obfuscatedHeadersEntries)
  if (obfuscatedHeaders.authorization) {
    obfuscatedHeaders.authorization = obfuscatedHeaders.authorization.replace(/"[^"]+"/g, '"***"')
  }
  if (obfuscatedHeaders.cookie) {
    obfuscatedHeaders.cookie = obfuscateParams(obfuscatedHeaders.cookie)
  }
  return obfuscatedHeaders
}

function obfuscateBody ({ url, body = '' }) {
  const { searchParams } = new URL(url)
  if (searchParams.get('action') === 'login') {
    return obfuscateParams(body)
  } else {
    return body.replace(/token=[^=\s;&]+([=\s;&]?)/g, 'token=***$1')
  }
}

function obfuscateParams (urlEncodedStr) {
  return urlEncodedStr.replace(/=[^=\s;&]+([=\s;&]?)/g, '=***$1')
}
