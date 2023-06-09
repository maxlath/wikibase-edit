const newIssueUrl = 'https://github.com/maxlath/wikibase-edit/issues/new'

const newIssue = ({ template, title = ' ', body = ' ', context }) => {
  title = encodeURIComponent(title)
  if (context != null) {
    body += 'Context:\n```json\n' + JSON.stringify(context, null, 2) + '\n```\n'
  }
  body = encodeURIComponent(body)
  return `Please open an issue at ${newIssueUrl}?template=${template}&title=${title}&body=${body}`
}

export const inviteToOpenAFeatureRequest = ({ title, body, context }) => {
  return newIssue({
    template: 'feature_request.md',
    title,
    body,
    context,
  })
}
