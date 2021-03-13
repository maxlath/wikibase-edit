/* eslint-disable no-undef */

describe('env', () => {
  it('check env', async () => {
    // Previously set on window by tests/browser/tests.html
    WBEdit.should.be.a.Function()
    WBK.should.be.a.Function()
    config.should.be.an.Object()
  })
})

describe('auth', () => {
  const wbEdit = WBEdit({
    instance: window.config.instance,
  })

  it('should be able to make an anonymous edit', async () => {
    const edit = { labels: { la: randomString() } }
    const reqConfig = { anonymous: true, origin: '*' }
    await wbEdit.entity.create(edit, reqConfig)
  })

  // Failing with CORS errors
  it('should be able to login with OAuth tokens', async () => {
    const edit = { labels: { la: randomString() } }
    const { oauth } = window.config.credentials
    const reqConfig = { credentials: { oauth }, origin: '*' }
    await wbEdit.entity.create(edit, reqConfig)
  })

  // Failing with 'Error: failed to login: invalid username/password'
  it('should be able to login with a username and password', async () => {
    const edit = { labels: { la: randomString() } }
    const { username, password } = window.config.credentialsAlt
    const reqConfig = { credentials: { username, password }, origin: '*' }
    await wbEdit.entity.create(edit, reqConfig)
  })
})

const randomString = () => new Date().getTime().toString()
