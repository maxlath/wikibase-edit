require('module-alias/register')
const { yellow } = require('chalk')
const { instance } = require('config')
const WBK = require('wikibase-sdk')
const wbk = WBK({ instance })
const fetch = require('lib/request/fetch')
const resolveTitle = require('../../../lib/resolve_title')

const getLastRevision = async (id, customInstance) => {
  customInstance = customInstance || instance
  const title = await resolveTitle(id, customInstance)
  const customWbk = WBK({ instance: customInstance })
  const url = customWbk.getRevisions(title, { limit: 1, prop: [ 'comment', 'tags' ] })
  const { query } = await fetch(url).then(res => res.json())
  return Object.values(query.pages)[0].revisions[0]
}

module.exports = {
  wait: ms => new Promise(resolve => setTimeout(resolve, ms)),

  getEntity: async id => {
    const url = wbk.getEntities({ ids: id })
    const { entities } = await fetch(url).then(res => res.json())
    return entities[id]
  },

  getLastRevision,

  getLastEditSummary: async id => {
    if (typeof id === 'object' && id.entity) id = id.entity.id
    const revision = await getLastRevision(id)
    return revision.comment
  },

  // A function to quickly fail when a test gets an undesired positive answer
  undesiredRes: done => res => {
    console.warn(yellow('undesired positive res:'), res)
    done(new Error('.then function was expected not to be called'))
  },

  // Same but for async/await tests that don't use done
  shouldNotBeCalled: res => {
    console.warn(yellow('undesired positive res:'), res)
    const err = new Error('function was expected not to be called')
    err.name = 'shouldNotBeCalled'
    err.context = { res }
    throw err
  },

  rethrowShouldNotBeCalledErrors: err => {
    if (err.name === 'shouldNotBeCalled') throw err
  },

  // See /wiki/Special:BotPasswords
  isBotPassword: password => password.match(/^\w+@[a-z0-9]{32}$/)
}
