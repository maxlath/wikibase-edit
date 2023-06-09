import 'should'
import config from 'config'
import wbEditFactory from '#root'

const wbEdit = wbEditFactory(config)

// Those tests require setting an instance with sitelinks
// (such as test.wikidata.org) in config, and are thus disabled by default
xdescribe('add badges', () => {
  it('should add a badge', async () => {
    await wbEdit.sitelink.set({
      id: 'Q224124',
      site: 'dewiki',
      title: 'September',
      badges: [ 'Q608' ],
    })
    const res = await wbEdit.badge.add({
      id: 'Q224124',
      site: 'dewiki',
      badges: [ 'Q609' ],
    })
    res.success.should.equal(1)
    res.entity.sitelinks.dewiki.badges.should.deepEqual([ 'Q608', 'Q609' ])
  })

  it('should ignore already added badges', async () => {
    await wbEdit.sitelink.set({
      id: 'Q224124',
      site: 'dewiki',
      title: 'September',
      badges: [ 'Q608' ],
    })
    const res = await wbEdit.badge.add({
      id: 'Q224124',
      site: 'dewiki',
      badges: [ 'Q608' ],
    })
    res.success.should.equal(1)
    res.entity.sitelinks.dewiki.badges.should.deepEqual([ 'Q608' ])
  })
})
