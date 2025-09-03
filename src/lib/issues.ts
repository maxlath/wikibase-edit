import { issues } from '../assets/metadata.js'
import type { ErrorContext } from './error.js'

const newIssueUrl = `${issues}/new`

interface IssueParams {
  template: string
  title?: string
  body?: string
  context: ErrorContext
}

function newIssue ({ template, title = ' ', body = ' ', context }: IssueParams) {
  title = encodeURIComponent(title)
  if (context != null) {
    body += 'Context:\n```json\n' + JSON.stringify(context, null, 2) + '\n```\n'
  }
  body = encodeURIComponent(body)
  return `Please open an issue at ${newIssueUrl}?template=${template}&title=${title}&body=${body}`
}

export function inviteToOpenAFeatureRequest ({ title, body, context }: Omit<IssueParams, 'template'>) {
  return newIssue({
    template: 'feature_request.md',
    title,
    body,
    context,
  })
}
