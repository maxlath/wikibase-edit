import should from 'should'
import { setSitelink } from '#lib/sitelink/set'
import { shouldNotBeCalled } from '#tests/integration/utils/utils'
import { assert } from '../utils'

describe('set sitelink', () => {
  it('should return wbsetsitelink params', () => {
    const { action, data } = setSitelink({
      id: 'Q123',
      site: 'frwiki',
      title: 'Septembre',
    })
    action.should.equal('wbsetsitelink')
    data.id.should.equal('Q123')
    data.linksite.should.equal('frwiki')
    data.linktitle.should.equal('Septembre')
    assert(!('badges' in data))
  })

  it('should reject without title', () => {
    try {
      // @ts-expect-error
      const res = setSitelink({
        id: 'Q123',
        site: 'frwiki',
      })
      shouldNotBeCalled(res)
    } catch (err) {
      err.message.should.containEql('invalid title')
      err.statusCode.should.equal(400)
    }
  })

  it('should accept with a null title to delete the sitelink', () => {
    const { action, data } = setSitelink({
      id: 'Q123',
      site: 'frwiki',
      title: null,
    })
    action.should.equal('wbsetsitelink')
    data.id.should.equal('Q123')
    data.linksite.should.equal('frwiki')
    should(data.linktitle).be.Undefined()
  })

  it('should accept badges as a string', () => {
    const { action, data } = setSitelink({
      id: 'Q123',
      site: 'frwiki',
      title: 'Septembre',
      badges: 'Q17437796|Q17437798',
    })
    action.should.equal('wbsetsitelink')
    data.id.should.equal('Q123')
    data.linksite.should.equal('frwiki')
    data.linktitle.should.equal('Septembre')
    assert('badges' in data)
    data.badges.should.equal('Q17437796|Q17437798')
  })

  it('should accept badges as an array', () => {
    const { action, data } = setSitelink({
      id: 'Q123',
      site: 'frwiki',
      title: 'Septembre',
      badges: 'Q17437796|Q17437798',
    })
    action.should.equal('wbsetsitelink')
    data.id.should.equal('Q123')
    data.linksite.should.equal('frwiki')
    data.linktitle.should.equal('Septembre')
    assert('badges' in data)
    data.badges.should.equal('Q17437796|Q17437798')
  })
})
