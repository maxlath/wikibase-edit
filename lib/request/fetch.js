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

export async function customFetch (url, { timeout, ...options } = {}) {
  options.agent = options.agent || agent
  if (debugMode) {
    const { method = 'get', headers, body } = options
    debug('request', method.toUpperCase(), url, {
      headers: obfuscateHeaders(headers),
      body: obfuscateBody({ url, body }),
    })
  }
  return fetchWithTimeout(url, options, timeout)
}

// Based on https://stackoverflow.com/questions/46946380/fetch-api-request-timeout#57888548
function fetchWithTimeout (url, options, timeoutMs = 120_000) {
  const controller = new AbortController()
  const promise = fetch(url, {
    keepalive: true,
    signal: controller.signal,
    credentials: 'include',
    mode: 'cors',
    ...options,
  })
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  return promise.finally(() => clearTimeout(timeout))
};

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
