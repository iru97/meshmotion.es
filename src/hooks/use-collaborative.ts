import { useState, useCallback, useRef, useEffect } from 'react'
import type {
  CollaborativeSession,
  CollaborativeState,
  Participant,
  ChatMessage,
  SessionSettings,
  CursorPosition,
} from '@/types/cloud'

/**
 * Generate a random color for participant
 */
function generateParticipantColor(): string {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Generate a short session code
 */
function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

/**
 * Hook for collaborative viewing sessions
 * Currently mock implementation - will connect to WebSocket backend when ready
 */
export function useCollaborative() {
  const [state, setState] = useState<CollaborativeState>({
    currentSession: null,
    isHost: false,
    isConnecting: false,
    isConnected: false,
    participants: [],
    messages: [],
    error: null,
    localParticipant: null,
  })

  const wsRef = useRef<WebSocket | null>(null)

  /**
   * Create a new collaborative session
   * TODO: Connect to WebSocket server when backend is ready
   */
  const createSession = useCallback(
    async (
      modelUrl: string,
      modelName: string,
      settings?: Partial<SessionSettings>
    ): Promise<CollaborativeSession | null> => {
      setState((s) => ({ ...s, isConnecting: true, error: null }))

      // Mock session creation
      const sessionCode = generateSessionCode()
      const participantColor = generateParticipantColor()

      const localParticipant: Participant = {
        id: `local-${Date.now()}`,
        name: 'You (Host)',
        color: participantColor,
        isHost: true,
        joinedAt: new Date().toISOString(),
        isConnected: true,
      }

      const session: CollaborativeSession = {
        id: `session-${Date.now()}`,
        code: sessionCode,
        hostId: localParticipant.id,
        hostName: localParticipant.name,
        modelName,
        modelUrl,
        participants: [localParticipant],
        settings: {
          allowCameraSync: true,
          allowAnnotations: true,
          allowChat: true,
          maxParticipants: 10,
          requireApproval: false,
          ...settings,
        },
        createdAt: new Date().toISOString(),
        isActive: true,
      }

      // Show backend required message
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: 'Collaborative viewing requires WebSocket backend. Coming soon!',
        // Still set up local session for UI preview
        currentSession: session,
        isHost: true,
        localParticipant,
        participants: [localParticipant],
      }))

      return session
    },
    []
  )

  /**
   * Join an existing session
   */
  const joinSession = useCallback(
    async (code: string, name: string): Promise<CollaborativeSession | null> => {
      setState((s) => ({ ...s, isConnecting: true, error: null }))

      setState((s) => ({
        ...s,
        isConnecting: false,
        error: 'Joining sessions requires WebSocket backend. Coming soon!',
      }))

      return null
    },
    []
  )

  /**
   * Leave current session
   */
  const leaveSession = useCallback(async (): Promise<void> => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setState({
      currentSession: null,
      isHost: false,
      isConnecting: false,
      isConnected: false,
      participants: [],
      messages: [],
      error: null,
      localParticipant: null,
    })
  }, [])

  /**
   * End session (host only)
   */
  const endSession = useCallback(async (): Promise<void> => {
    if (!state.isHost) {
      setState((s) => ({ ...s, error: 'Only the host can end the session' }))
      return
    }
    await leaveSession()
  }, [state.isHost, leaveSession])

  /**
   * Sync camera position with other participants
   */
  const syncCamera = useCallback(
    (position: [number, number, number], target: [number, number, number]) => {
      if (!state.isConnected || !wsRef.current) return

      // Would send via WebSocket
      // wsRef.current.send(JSON.stringify({ type: 'camera', position, target }))
    },
    [state.isConnected]
  )

  /**
   * Update cursor position
   */
  const updateCursor = useCallback(
    (cursorPosition: CursorPosition) => {
      if (!state.isConnected || !wsRef.current) return

      // Would send via WebSocket
      // wsRef.current.send(JSON.stringify({ type: 'cursor', ...cursorPosition }))
    },
    [state.isConnected]
  )

  /**
   * Send chat message
   */
  const sendMessage = useCallback(
    (content: string) => {
      if (!state.currentSession || !state.localParticipant) return

      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        participantId: state.localParticipant.id,
        participantName: state.localParticipant.name,
        content,
        timestamp: new Date().toISOString(),
        type: 'text',
      }

      setState((s) => ({
        ...s,
        messages: [...s.messages, message],
      }))

      // Would send via WebSocket when connected
    },
    [state.currentSession, state.localParticipant]
  )

  /**
   * Kick a participant (host only)
   */
  const kickParticipant = useCallback(
    async (participantId: string): Promise<void> => {
      if (!state.isHost) {
        setState((s) => ({ ...s, error: 'Only the host can kick participants' }))
        return
      }

      setState((s) => ({
        ...s,
        participants: s.participants.filter((p) => p.id !== participantId),
      }))
    },
    [state.isHost]
  )

  /**
   * Get shareable session link
   */
  const getShareableLink = useCallback((): string | null => {
    if (!state.currentSession) return null

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/collab/${state.currentSession.code}`
  }, [state.currentSession])

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }))
  }, [])

  /**
   * Check if collaborative features are available
   */
  const isAvailable = false // Will be true when WebSocket backend is ready

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return {
    ...state,
    isAvailable,
    createSession,
    joinSession,
    leaveSession,
    endSession,
    syncCamera,
    updateCursor,
    sendMessage,
    kickParticipant,
    getShareableLink,
    clearError,
  }
}
