const { yellow } = require('chalk')
const { instance } = require('config')
const wbk = require('wikibase-sdk')({ instance })
const fetch = require('cross-fetch')
const resolveTitle = require('../../../lib/resolve_title')

// A function to quickly fail when a test gets an undesired positive answer
const undesiredRes = done => res => {
  console.warn(yellow('undesired positive res:'), res)
  done(new Error('.then function was expected not to be called'))
}

const delay = delayMs => new Promise(resolve => setTimeout(resolve, delayMs))

const getLastRevision = async id => {
  const title = await resolveTitle(id, instance)
  const url = wbk.getRevisions(title, { limit: 1 })
  const { query } = await fetch(url).then(res => res.json())
  return Object.values(query.pages)[0].revisions[0]
}

module.exports = { undesiredRes, delay, getLastRevision }
