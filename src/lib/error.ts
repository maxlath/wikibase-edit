type ErrorContext = Record<string, unknown>

interface ContextualizedError extends Error {
  statusCode?: number
  context?: ErrorContext
  code?: string
  body?: unknown
}

export function newError (message: string, statusCode?: number | ErrorContext, context?: ErrorContext) {
  const err: ContextualizedError = new Error(message)
  if (typeof statusCode !== 'number') {
    if (context == null) {
      context = statusCode
      statusCode = 400
    } else {
      throw newError('invalid error status code', 500, { message, statusCode, context })
    }
  }
  err.statusCode = statusCode
  if (context) {
    context = convertSetsIntoArrays(context)
    err.context = context
    err.stack += `\n[context] ${JSON.stringify(context)}`
  }
  return err
}

function convertSetsIntoArrays (context: ErrorContext) {
  const convertedContext = {}
  for (const key in context) {
    const value = context[key]
    convertedContext[key] = value instanceof Set ? Array.from(value) : value
  }
  return convertedContext
}
