require('should')
const config = require('config')
const wbEdit = require('root')(config)

// Those tests require setting an instance with sitelinks
// (such as test.wikidata.org) in config, and are thus disabled by default
xdescribe('set sitelink', () => {
  it('should set a sitelink', async () => {
    const res = await wbEdit.sitelink.set({
      id: 'Q224124',
      site: 'frwiki',
      title: 'Septembre',
      badges: 'Q608|Q609',
    })
    res.success.should.equal(1)
    res.entity.id.should.equal('Q224124')
    res.entity.sitelinks.frwiki.title.should.equal('Septembre')
    res.entity.sitelinks.frwiki.badges.should.deepEqual([ 'Q608', 'Q609' ])
  })

  it('should remove a sitelink', async () => {
    await wbEdit.sitelink.set({
      id: 'Q224124',
      site: 'eswiki',
      title: 'Septiembre',
    })
    const res = await wbEdit.sitelink.set({
      id: 'Q224124',
      site: 'eswiki',
      title: null,
    })
    res.success.should.equal(1)
    res.entity.id.should.equal('Q224124')
    res.entity.sitelinks.eswiki.removed.should.equal('')
  })
})
