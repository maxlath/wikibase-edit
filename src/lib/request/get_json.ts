import { request, type RequestParams } from './request.js'
import type { AbsoluteUrl } from '../types/common.js'

export function getJson (url: AbsoluteUrl, params: Partial<RequestParams> = {}) {
  // Ignore cases were a map function passed an index as second argument
  // ex: Promise.all(urls.map(getJson))
  if (typeof params !== 'object') params = {}

  params.url = url
  return request('get', params as RequestParams)
}
