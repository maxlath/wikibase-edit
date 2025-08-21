const knownIssues = {
  wbmergeitems: {
    internal_api_error_TypeError: 'https://phabricator.wikimedia.org/T232925',
  },
}

export default (url, err) => {
  if (!url) return
  const actionMatch = url.match(/action=(\w+)/)
  if (!actionMatch) return
  const action = actionMatch[1]
  if (knownIssues[action] && knownIssues[action][err.name]) {
    const ticketUrl = knownIssues[action][err.name]
    console.error(`this is a known issue, please help documenting it at ${ticketUrl}`)
    throw err
  }
}
