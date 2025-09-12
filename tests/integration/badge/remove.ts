import 'should'
import config from 'config'
import WBEdit from '#root'
import { assert } from '../../unit/utils'

const wbEdit = WBEdit(config)

// Those tests require setting an instance with sitelinks
// (such as test.wikidata.org) in config, and are thus disabled by default
xdescribe('remove badges', () => {
  it('should remove a badge', async () => {
    await wbEdit.sitelink.set({
      id: 'Q224124',
      site: 'dewiki',
      title: 'September',
      badges: [ 'Q608' ],
    })
    const res = await wbEdit.badge.remove({
      id: 'Q224124',
      site: 'dewiki',
      badges: [ 'Q608' ],
    })
    res.success.should.equal(1)
    assert('sitelinks' in res.entity)
    res.entity.sitelinks.dewiki.badges.should.deepEqual([])
  })

  it('should ignore absent badges', async () => {
    await wbEdit.sitelink.set({
      id: 'Q224124',
      site: 'dewiki',
      title: 'September',
      badges: [ 'Q608' ],
    })
    const res = await wbEdit.badge.remove({
      id: 'Q224124',
      site: 'dewiki',
      badges: [ 'Q609' ],
    })
    res.success.should.equal(1)
    assert('sitelinks' in res.entity)
    res.entity.sitelinks.dewiki.badges.should.deepEqual([ 'Q608' ])
  })
})
