import config from 'config'
import { yellow } from 'tiny-chalk'
import { WBK, type EntityId } from 'wikibase-sdk'
import { newError } from '#lib/error'
import { customFetch } from '#lib/request/fetch'
import { resolveTitle } from '#lib/resolve_title'
import type { AbsoluteUrl } from '#lib/types/common'

const { instance } = config

const wbk = WBK({ instance })

export interface GetRevisionsParams {
  id: EntityId
  customInstance?: AbsoluteUrl
  limit?: number
  props?: string | string[]
}

async function getRevisions ({ id, customInstance, limit, props }) {
  customInstance = customInstance || instance
  const title = await resolveTitle(id, `${customInstance}/w/api.php` as AbsoluteUrl)
  const customWbk = WBK({ instance: customInstance })
  const url = customWbk.getRevisions({ ids: title, limit, prop: props }) as AbsoluteUrl
  const { query } = await customFetch(url).then(res => res.json())
  const page = Object.values(query.pages)[0]
  if (!(typeof page === 'object' && 'revisions' in page)) {
    throw newError('revisions not found', 400, { id, url, page })
  }
  return page.revisions
}

export async function getLastRevision (id: EntityId, customInstance?: AbsoluteUrl) {
  const revisions = await getRevisions({ id, customInstance, limit: 1, props: [ 'comment', 'tags' ] })
  return revisions[0]
}

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export async function getEntity (id: EntityId) {
  const url = wbk.getEntities({ ids: id }) as AbsoluteUrl
  const { entities } = await customFetch(url).then(res => res.json())
  return entities[id]
}

export async function getEntityHistory (id: EntityId, customInstance?: AbsoluteUrl) {
// @ts-expect-error
  const revisions = await getRevisions({ id, customInstance })
  // @ts-expect-error
  return revisions.sort(chronologically)
}

export async function getLastEditSummary (id: EntityId) {
  // @ts-expect-error
  if (typeof id === 'object' && id.entity) id = id.entity.id
  const revision = await getLastRevision(id)
  return revision.comment
}

// A function to quickly fail when a test gets an undesired positive answer
export const undesiredRes = done => res => {
  console.warn(yellow('undesired positive res:'), res)
  done(new Error('.then function was expected not to be called'))
}

// Same but for async/await tests that don't use done
export function shouldNotBeCalled (res) {
  console.warn(yellow('undesired positive res:'), res)
  const err = new Error('function was expected not to be called')
  err.name = 'shouldNotBeCalled'
  err.context = { res }
  throw err
}

export function rethrowShouldNotBeCalledErrors (err) {
  if (err.name === 'shouldNotBeCalled') throw err
}

// See /wiki/Special:BotPasswords
export const isBotPassword = password => password.match(/^\w+@[a-z0-9]{32}$/)

const chronologically = (a, b) => a.revid - b.revid
