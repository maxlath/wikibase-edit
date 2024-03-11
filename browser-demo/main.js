import WbEdit from './wikibase-edit.js'

console.log('hillo')

const wbEdit = WbEdit({
  instance: 'https://www.wikidata.org',
  credentials: {
    browserSession: true,
  },
})

document.addEventListener('click', async e => {
  if (e.target.tagName === 'BUTTON' && document.getElementById('text').value) {
    try {
      const res = await wbEdit.alias.add({
        id: 'Q112795079',
        language: 'fr',
        value: document.getElementById('text').value,
      })
      document.getElementById('response').innerText = JSON.stringify(res, null, 2)
    } catch (err) {
      document.getElementById('response').innerText = err.stack || err.toString()
    }
  }
})
