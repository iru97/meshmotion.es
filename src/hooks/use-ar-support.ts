import { useState, useEffect, useCallback } from 'react'

interface ARSupportInfo {
  isSupported: boolean
  webXRSupported: boolean
  sceneViewerSupported: boolean
  quickLookSupported: boolean
  platform: 'ios' | 'android' | 'desktop' | 'unknown'
}

/**
 * Hook for detecting and managing AR support
 */
export function useARSupport() {
  const [supportInfo, setSupportInfo] = useState<ARSupportInfo>({
    isSupported: false,
    webXRSupported: false,
    sceneViewerSupported: false,
    quickLookSupported: false,
    platform: 'unknown',
  })
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkARSupport = async () => {
      setIsChecking(true)

      // Detect platform
      const userAgent = navigator.userAgent.toLowerCase()
      let platform: ARSupportInfo['platform'] = 'unknown'

      if (/iphone|ipad|ipod/.test(userAgent)) {
        platform = 'ios'
      } else if (/android/.test(userAgent)) {
        platform = 'android'
      } else {
        platform = 'desktop'
      }

      // Check WebXR support
      let webXRSupported = false
      if (navigator.xr) {
        try {
          webXRSupported = await navigator.xr.isSessionSupported('immersive-ar')
        } catch {
          webXRSupported = false
        }
      }

      // Check Scene Viewer support (Android)
      const sceneViewerSupported = platform === 'android'

      // Check Quick Look support (iOS 12+)
      const quickLookSupported = platform === 'ios' &&
        document.createElement('a').relList?.supports?.('ar')

      const isSupported = webXRSupported || sceneViewerSupported || quickLookSupported

      setSupportInfo({
        isSupported,
        webXRSupported,
        sceneViewerSupported,
        quickLookSupported,
        platform,
      })

      setIsChecking(false)
    }

    checkARSupport()
  }, [])

  /**
   * Launch AR view for a model
   * @param modelUrl URL to the GLB/GLTF model
   * @param modelTitle Optional title for the model
   */
  const launchAR = useCallback(async (modelUrl: string, modelTitle?: string) => {
    if (!supportInfo.isSupported) {
      console.warn('AR is not supported on this device')
      return false
    }

    // iOS Quick Look - needs USDZ format
    if (supportInfo.quickLookSupported) {
      // For iOS, we'd need to convert to USDZ or use a pre-converted file
      // For now, show an info message
      alert('AR on iOS requires USDZ format. Please export your model as USDZ to use AR Quick Look.')
      return false
    }

    // Android Scene Viewer
    if (supportInfo.sceneViewerSupported) {
      const encodedUrl = encodeURIComponent(modelUrl)
      const encodedTitle = encodeURIComponent(modelTitle || 'Model')

      // Intent URL for Google Scene Viewer
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodedUrl}&mode=ar_only&title=${encodedTitle}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`

      window.location.href = intentUrl
      return true
    }

    // WebXR (if supported)
    if (supportInfo.webXRSupported) {
      // WebXR requires more complex setup with Three.js
      // This would need integration with the existing scene
      alert('WebXR AR mode requires additional setup. Coming soon!')
      return false
    }

    return false
  }, [supportInfo])

  return {
    ...supportInfo,
    isChecking,
    launchAR,
  }
}
