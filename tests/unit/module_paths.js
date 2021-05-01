require('should')

describe('module paths', () => {
  // Module aliases are reserved for tests, to not add another production dependency
  it('should not require module aliases', () => {
    require('module-alias').reset()
    resetRequireCache()

    const wbEdit = require('../..')
    console.log('wbEdit', wbEdit)
  })
})

const resetRequireCache = () => {
  Object.keys(require.cache)
  .filter(key => key.includes('wikibase-edit'))
  .forEach(key => delete require.cache[key])
}
