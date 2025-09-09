import { newError } from '../error.js'
import { buildUrl, wait } from '../utils.js'
import { request } from './request.js'
import type { HttpHeaders, HttpRequestAgent } from './fetch.js'
import type { ParsedTokenInfo } from './get_final_token.js'
import type { AbsoluteUrl, BaseRevId, MaxLag } from '../types/common.js'
import type { OAuthCredentials, SerializedConfig } from '../types/config.js'

export const defaultMaxlag = 5

export async function post (action: string, data: object, config: SerializedConfig) {
  const { anonymous } = config
  const getAuthData = anonymous ? null : config.credentials._getAuthData

  async function tryActionPost () {
    if (anonymous) {
      return actionPost({ action, data, config })
    } else {
      const authData = await getAuthData()
      return actionPost({ action, data, config, authData })
    }
  }

  async function insistentRequest (attempt = 0) {
    try {
      return await tryActionPost()
    } catch (err) {
      // Known case of required retrial: token expired
      if (attempt < 10 && !anonymous && mayBeSolvedByTokenRefresh(err)) {
        await getAuthData({ refresh: true })
        await wait(attempt * 1000)
        return insistentRequest(++attempt)
      } else {
        throw err
      }
    }
  }

  return insistentRequest()
}

export interface PostData {
  assert?: 'bot' | 'user'
  token?: string
  summary?: string
  baserevid?: BaseRevId
  tags?: string
  maxlag?: MaxLag
  title?: string
}

interface ActionPostParams {
  action: string
  data: PostData
  config: SerializedConfig
  authData?: ParsedTokenInfo
}

export interface PostQuery {
  action: string
  format: 'json'
  bot?: boolean
}

interface PostParams {
  url: AbsoluteUrl
  headers: HttpHeaders
  autoRetry?: boolean
  httpRequestAgent?: HttpRequestAgent
  oauth?: OAuthCredentials['oauth']
  body: PostData
}

async function actionPost ({ action, data, config, authData }: ActionPostParams) {
  const { instanceApiEndpoint, userAgent, bot, summary, baserevid, tags, maxlag, anonymous } = config

  const query: PostQuery = { action, format: 'json' }

  if (bot) {
    query.bot = true
    data.assert = 'bot'
  } else if (!anonymous) {
    data.assert = 'user'
  }

  const params: Partial<PostParams> = {
    url: buildUrl(instanceApiEndpoint, query),
    headers: {
      'user-agent': userAgent,
    },
    autoRetry: config.autoRetry,
    httpRequestAgent: config.httpRequestAgent,
  }

  if (anonymous) {
    // The edit token for logged-out users is a hardcoded string of +\
    // cf https://phabricator.wikimedia.org/T40417
    data.token = '+\\'
  } else {
    if ('oauth' in config.credentials) {
      params.oauth = config.credentials.oauth
    }
    params.headers.cookie = authData.cookie
    data.token = authData.token
  }

  if (summary != null) data.summary = data.summary || summary
  if (baserevid != null) data.baserevid = data.baserevid || baserevid
  if (tags != null) data.tags = data.tags || tags.join('|')
  // Allow to omit the maxlag by passing null, see https://github.com/maxlath/wikibase-edit/pull/65
  if (maxlag !== null) data.maxlag = maxlag || defaultMaxlag

  params.body = data

  const body = await request('post', params as PostParams)
  if (body.error) {
    const errMessage = `action=${action} error: ${body.error.info}`
    const err = newError(errMessage, { params, body })
    err.body = body
    throw err
  }
  return body
}

function mayBeSolvedByTokenRefresh (err) {
  if (!(err?.body?.error)) return false
  const errorCode = err.body.error.code || ''
  return tokenErrors.includes(errorCode)
}

// Errors that might be resolved by a refreshed token
const tokenErrors = [
  'badtoken',
  'notoken',
  'assertuserfailed',
]
