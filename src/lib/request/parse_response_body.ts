import { debug } from '../debug.js'

export default async res => {
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

const requestError = (res, body) => {
  const { code, info } = body.error || {}
  const errMessage = `${code}: ${info}`
  const err = new Error(errMessage)
  err.name = code
  if (res.status === 200) {
    // Override false positive status code
    err.statusCode = 500
  } else {
    err.statusCode = res.status
  }
  err.statusMessage = res.statusMessage
  err.headers = res.headers
  err.body = body
  err.url = res.url
  if (res.url) err.stack += `\nurl: ${res.url}`
  if (res.status) err.stack += `\nresponse status: ${res.status}`
  if (body) err.stack += `\nresponse body: ${JSON.stringify(body)}`
  err.context = { url: res.url, body }
  return err
}
