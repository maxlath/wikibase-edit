// - Formatting cookies to match servers expecations (dropping 'HttpOnly')
// - Removing all the non-required cookies (reducing noise for debugging)

// The final cookie should look like:
// docker-wikibase: 'wikibase_session=dqnrrb70jaci8cgdl2s0am0oqtr02cp1; wikibaseUserID=1'
// wikimedia servers: 'testwikidatawikiSession=cd7h39ik5lf4leh1dugts9vkta4t2e0d; testwikidatawikiUserID=1; testwikidatawikiUserName=Someusername; centralauth_Token=f355932ed4da146b29f7887179af746b; centralauth_Session=950509520bb4bd3dbc7d595c4b06141c;'

export default resCookies => {
  return resCookies
  .split(parameterSeparator)
  .map(formatCookieParameter)
  .filter(parameter => isRequiredCookieKey(parameter.split('=')[0]))
  .join(parameterSeparator)
  .trim()
}

const parameterSeparator = '; '

const isRequiredCookieKey = key => key.match(/(User\w*|[sS]ession|[tT]oken)$/)

const formatCookieParameter = parameter => {
  return parameter
  // Somehow, it fails to get cookies if the answer parameter is prefixed with HttpOnly
  .replace('HttpOnly,', '')
  .trim()
}
