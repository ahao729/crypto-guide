import type { Instrumentation } from "next"

/**
 * Emit one structured line per server error. Vercel Logs can filter on
 * `"type":"request_error"`; the same format can later be shipped to Sentry or
 * a log drain without changing call sites.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  const err = error as Error & { digest?: string }

  console.error(
    JSON.stringify({
      type: "request_error",
      message: err.message,
      digest: err.digest,
      path: request.path,
      method: request.method,
      routePath: context.routePath,
      routeType: context.routeType,
      routerKind: context.routerKind,
      timestamp: new Date().toISOString(),
    })
  )
}
