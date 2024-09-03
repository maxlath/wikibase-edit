import error_ from '../error.js'
import { buildUrl, wait } from '../utils.js'
import request from './request.js'

export const defaultMaxlag = 5

export default async (action, data, config) => {
  const { anonymous } = config
  const getAuthData = anonymous ? null : config.credentials._getAuthData

  const tryActionPost = async () => {
    if (anonymous) {
      return actionPost({ action, data, config })
    } else {
      const authData = await getAuthData()
      return actionPost({ action, data, config, authData })
    }
  }

  const insistentRequest = async (attempt = 0) => {
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

const actionPost = async ({ action, data, config, authData }) => {
  const { instanceApiEndpoint, userAgent, bot, summary, baserevid, tags, maxlag, anonymous } = config

  const query = { action, format: 'json' }

  if (bot) {
    query.bot = true
    data.assert = 'bot'
  } else if (!anonymous) {
    data.assert = 'user'
  }

  const params = {
    url: buildUrl(instanceApiEndpoint, query),
    headers: {
      'User-Agent': userAgent,
    },
    autoRetry: config.autoRetry,
    httpRequestAgent: config.httpRequestAgent,
  }

  if (anonymous) {
    // The edit token for logged-out users is a hardcoded string of +\
    // cf https://phabricator.wikimedia.org/T40417
    data.token = '+\\'
  } else {
    params.oauth = config.credentials.oauth
    params.headers.cookie = authData.cookie
    data.token = authData.token
  }

  if (summary != null) data.summary = data.summary || summary
  if (baserevid != null) data.baserevid = data.baserevid || baserevid
  if (tags != null) data.tags = data.tags || tags.join('|')
  // Allow to omit the maxlag by passing null, see https://github.com/maxlath/wikibase-edit/pull/65
  if (maxlag !== null) data.maxlag = maxlag || defaultMaxlag

  params.body = data

  const body = await request('post', params)
  if (body.error) {
    const errMessage = `action=${action} error: ${body.error.info}`
    const err = error_.new(errMessage, { params, body })
    err.body = body
    throw err
  }
  return body
}

const mayBeSolvedByTokenRefresh = err => {
  if (!(err && err.body && err.body.error)) return false
  const errorCode = err.body.error.code || ''
  return tokenErrors.includes(errorCode)
}

// Errors that might be resolved by a refreshed token
const tokenErrors = [
  'badtoken',
  'notoken',
  'assertuserfailed',
]
