import fetch from 'cross-fetch'
import { debug, debugMode } from '../debug.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { Agent as HttpAgent } from 'node:http'
import type { Agent as HttpsAgent } from 'node:https'

const isNode = globalThis.process?.versions?.node != null

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

export type HttpHeaderKey = 'content-type' | 'cookie' | 'user-agent'
export type HttpHeaders = Partial<Record<HttpHeaderKey, string>>
export type HttpMethodLowerCased = 'get' | 'post' | 'put' | 'delete'
export type HttpMethod = HttpMethodLowerCased | Uppercase<HttpMethodLowerCased>

export interface CustomFetchOptions {
  method?: HttpMethod
  headers?: HttpHeaders
  timeout?: number
  agent?: HttpAgent | HttpsAgent
  body?: string
}

export type HttpRequestAgent = HttpAgent | HttpsAgent

export async function customFetch (url: AbsoluteUrl, { timeout, ...options }: CustomFetchOptions = {}) {
  options.agent = options.agent || agent
  if (debugMode) {
    const { method = 'get', headers, body } = options
    debug('request', method.toUpperCase(), url, {
      headers: obfuscateHeaders(headers),
      body: obfuscateBody({ url, body }),
    })
  }
  try {
    return await fetchWithTimeout(url, options, timeout)
  } catch (err) {
    if (err.type === 'aborted') {
      const rephrasedErr = new Error('request timeout')
      rephrasedErr.cause = err
      throw rephrasedErr
    } else {
      throw err
    }
  }
}

// Based on https://stackoverflow.com/questions/46946380/fetch-api-request-timeout#57888548
function fetchWithTimeout (url: AbsoluteUrl, options: CustomFetchOptions, timeoutMs = 120_000) {
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

function obfuscateHeaders (headers: HttpHeaders) {
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

function obfuscateBody ({ url, body = '' }: { url: string, body?: string }) {
  const { searchParams } = new URL(url)
  if (searchParams.get('action') === 'login') {
    return obfuscateParams(body)
  } else {
    return body.replace(/token=[^=\s;&]+([=\s;&]?)/g, 'token=***$1')
  }
}

function obfuscateParams (urlEncodedStr: string) {
  return urlEncodedStr.replace(/=[^=\s;&]+([=\s;&]?)/g, '=***$1')
}
