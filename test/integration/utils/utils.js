const { yellow } = require('chalk')
const { instance, __ } = require('config')
const WBK = require('wikibase-sdk')
const fetch = __.require('lib/request/fetch')
const resolveTitle = require('../../../lib/resolve_title')

module.exports = {
  delay: delayMs => new Promise(resolve => setTimeout(resolve, delayMs)),

  getLastRevision: async (id, customInstance) => {
    customInstance = customInstance || instance
    const title = await resolveTitle(id, customInstance)
    const wbk = WBK({ instance: customInstance })
    const url = wbk.getRevisions(title, { limit: 1, prop: [ 'comment', 'tags' ] })
    const { query } = await fetch(url).then(res => res.json())
    return Object.values(query.pages)[0].revisions[0]
  },

  // A function to quickly fail when a test gets an undesired positive answer
  undesiredRes: done => res => {
    console.warn(yellow('undesired positive res:'), res)
    done(new Error('.then function was expected not to be called'))
  },

  // Same but for async/await tests that don't use done
  shouldNotGetHere: res => {
    console.warn(yellow('undesired positive res:'), res)
    const err = new Error('function was expected not to be called')
    err.name = 'ShouldNotGetHere'
    err.context = { res }
    throw err
  },

  rethrowShouldNotGetHereErrors: err => {
    if (err.name === 'ShouldNotGetHere') throw err
  }
}
