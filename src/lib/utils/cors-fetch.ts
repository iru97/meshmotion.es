/**
 * CORS Proxy Fetch Utility
 *
 * Handles fetching files from URLs that may be blocked by CORS.
 * First tries direct fetch, then offers proxy fallback with user consent.
 */

const CORS_PROXY_URL = 'https://corsproxy.io/?'

export interface FetchResult {
  success: boolean
  blob?: Blob
  error?: string
  usedProxy?: boolean
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
 * Fetch a file through the CORS proxy
 */
export async function fetchViaProxy(url: string): Promise<FetchResult> {
  try {
    const proxyUrl = `${CORS_PROXY_URL}${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl, { mode: 'cors' })

    if (!response.ok) {
      return {
        success: false,
        error: `Proxy returned HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const blob = await response.blob()
    return { success: true, blob, usedProxy: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Proxy fetch failed',
    }
  }
}

/**
 * Fetch with automatic CORS detection
 * Returns corsBlocked: true if direct fetch fails due to CORS
 */
export async function fetchWithCorsDetection(url: string): Promise<FetchResult> {
  return fetchDirect(url)
}
