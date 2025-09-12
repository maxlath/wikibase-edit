import { debug } from '../debug.js'
import type { ContextualizedError } from '../error.js'
import type { APIResponseError } from './request.js'
import type { AbsoluteUrl } from '../types/common.js'

export async function parseResponseBody (res: Response) {
  const raw = await res.text()
  let data
  try {
    data = JSON.parse(raw)
  } catch (err) {
    const customErr = new Error('Could not parse response: ' + raw)
    customErr.cause = err
    customErr.name = 'wrong response format'
    throw customErr
  }
  debug('response', res.url, res.status, data)
  if (data.error != null) throw requestError(res, data)
  else return data
}

function requestError (res: Response, body: { error: APIResponseError }) {
  const { code, info } = body.error || {}
  const errMessage = `${code}: ${info}`
  const err: ContextualizedError = new Error(errMessage)
  err.name = code
  if (res.status === 200) {
    // Override false positive status code
    err.statusCode = 500
  } else {
    err.statusCode = res.status
  }
  err.headers = res.headers
  err.body = body
  err.url = res.url as AbsoluteUrl
  if (res.url) err.stack += `\nurl: ${res.url}`
  if (res.status) err.stack += `\nresponse status: ${res.status}`
  if (body) err.stack += `\nresponse body: ${JSON.stringify(body)}`
  err.context = { url: res.url, body }
  return err
}
