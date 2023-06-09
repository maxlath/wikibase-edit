import { yellow } from 'chalk'
import { instance } from 'config'
import WBK from 'wikibase-sdk'
import fetch from '#lib/request/fetch'
import resolveTitle from '#lib/resolve_title'

const wbk = WBK({ instance })

const getRevisions = async ({ id, customInstance, limit, props }) => {
  customInstance = customInstance || instance
  const title = await resolveTitle(id, `${customInstance}/w/api.php`)
  const customWbk = WBK({ instance: customInstance })
  const url = customWbk.getRevisions(title, { limit, props })
  const { query } = await fetch(url).then(res => res.json())
  return Object.values(query.pages)[0].revisions
}

export async function getLastRevision (id, customInstance) {
  const revisions = await getRevisions({ id, customInstance, limit: 1, props: [ 'comment', 'tags' ] })
  return revisions[0]
}

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export const getEntity = async id => {
  const url = wbk.getEntities({ ids: id })
  const { entities } = await fetch(url).then(res => res.json())
  return entities[id]
}

export const getEntityHistory = async (id, customInstance) => {
  const revisions = await getRevisions({ id, customInstance })
  return revisions.sort(chronologically)
}

export const getLastEditSummary = async id => {
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
export const shouldNotBeCalled = res => {
  console.warn(yellow('undesired positive res:'), res)
  const err = new Error('function was expected not to be called')
  err.name = 'shouldNotBeCalled'
  err.context = { res }
  throw err
}

export const rethrowShouldNotBeCalledErrors = err => {
  if (err.name === 'shouldNotBeCalled') throw err
}

// See /wiki/Special:BotPasswords
export const isBotPassword = password => password.match(/^\w+@[a-z0-9]{32}$/)

const chronologically = (a, b) => a.revid - b.revid
