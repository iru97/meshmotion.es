/**
 * CORS Proxy Fetch Utility
 *
 * Handles fetching files from URLs that may be blocked by CORS.
 * First tries direct fetch, then offers proxy fallback with user consent.
 * Tries multiple proxy services for better reliability.
 */

// List of CORS proxy services to try (in order)
const CORS_PROXIES = [
  { name: 'corsproxy.io', getUrl: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}` },
  { name: 'allorigins', getUrl: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` },
  { name: 'corsproxy.io (raw)', getUrl: (url: string) => `https://corsproxy.io/?${url}` },
]

export interface FetchResult {
  success: boolean
  blob?: Blob
  error?: string
  usedProxy?: boolean
  proxyName?: string
  corsBlocked?: boolean
}

/**
 * Check if an error is likely a CORS error
 */
function isCorsError(error: unknown): boolean {
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase()
    return (
      message.includes('failed to fetch') ||
      message.includes('network') ||
      message.includes('cors')
    )
  }
  return false
}

/**
 * Fetch a file directly without proxy
 */
export async function fetchDirect(url: string): Promise<FetchResult> {
  try {
    const response = await fetch(url, { mode: 'cors' })

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const blob = await response.blob()
    return { success: true, blob, usedProxy: false }
  } catch (error) {
    if (isCorsError(error)) {
      return {
        success: false,
        error: 'CORS blocked',
        corsBlocked: true,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch',
    }
  }
}

/**
 * Fetch a file through CORS proxies (tries multiple)
 */
export async function fetchViaProxy(url: string): Promise<FetchResult> {
  const errors: string[] = []

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy.getUrl(url)
      const response = await fetch(proxyUrl, { mode: 'cors' })

      if (response.ok) {
        const blob = await response.blob()

        // Verify we got actual content (not an error page)
        if (blob.size > 0) {
          return { success: true, blob, usedProxy: true, proxyName: proxy.name }
        }
      }

      errors.push(`${proxy.name}: HTTP ${response.status}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      errors.push(`${proxy.name}: ${msg}`)
    }
  }

  // Check if URL looks like a signed/authenticated URL
  const isSignedUrl = url.includes('Expires=') || url.includes('Signature=') || url.includes('token=')
  const hint = isSignedUrl
    ? ' This appears to be a signed/authenticated URL which may not work through proxies. Try downloading the file directly and uploading it.'
    : ''

  return {
    success: false,
    error: `All proxies failed.${hint} (${errors.join('; ')})`,
  }
}

/**
 * Fetch with automatic CORS detection
 * Returns corsBlocked: true if direct fetch fails due to CORS
 */
export async function fetchWithCorsDetection(url: string): Promise<FetchResult> {
  return fetchDirect(url)
}
