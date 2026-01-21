'use client'

import { useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { useCollaborative } from '@/hooks/use-collaborative'
import { cn } from '@/lib/utils'
import {
  X,
  Users,
  Copy,
  UserPlus,
  Crown,
  MessageSquare,
  Send,
  LogOut,
  AlertCircle,
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
} from 'lucide-react'

interface CollaborativePanelProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Panel for collaborative viewing sessions
 * Phase 4 feature - requires WebSocket backend
 */
export function CollaborativePanel({ isOpen, onClose }: CollaborativePanelProps) {
  const theme = useThemeClasses()
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  const {
    currentSession,
    isHost,
    isConnecting,
    isConnected,
    participants,
    messages,
    error,
    isAvailable,
    createSession,
    joinSession,
    leaveSession,
    sendMessage,
    getShareableLink,
    clearError,
  } = useCollaborative()

  const [mode, setMode] = useState<'none' | 'create' | 'join'>('none')
  const [joinCode, setJoinCode] = useState('')
  const [userName, setUserName] = useState('')
  const [chatMessage, setChatMessage] = useState('')

  if (!isOpen) return null

  const handleCreate = async () => {
    if (!currentCharacter) return
    await createSession(
      currentCharacter.url || '',
      currentCharacter.name
    )
  }

  const handleJoin = async () => {
    if (!joinCode || !userName) return
    await joinSession(joinCode, userName)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    sendMessage(chatMessage)
    setChatMessage('')
  }

  const copySessionLink = () => {
    const link = getShareableLink()
    if (link) {
      navigator.clipboard.writeText(link)
    }
  }

  // Session View
  if (currentSession) {
    return (
      <div
        className={cn(
          'fixed top-20 left-4 z-40',
          'w-80 max-h-[600px] overflow-hidden flex flex-col',
          'rounded-xl border border-white/10',
          theme.glassPanelDark
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className={cn('w-5 h-5', theme.textPrimary)} />
            <div>
              <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
                Session: {currentSession.code}
              </h3>
              <p className={cn('text-xs', theme.textMuted)}>
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
          >
            <X className={cn('w-4 h-4', theme.textSecondary)} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-yellow-300">{error}</p>
                <button
                  onClick={clearError}
                  className="text-[10px] text-yellow-400 hover:underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Link */}
        <div className="p-4 border-b border-white/10">
          <p className={cn('text-xs mb-2', theme.textMuted)}>Share this link:</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={getShareableLink() || ''}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-xs',
                'bg-white/5 border border-white/10 text-white',
                'focus:outline-none'
              )}
            />
            <button
              onClick={copySessionLink}
              className={cn(
                'px-3 py-2 rounded-lg',
                'bg-white/10 hover:bg-white/20',
                theme.textSecondary
              )}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Participants */}
        <div className="p-4 border-b border-white/10">
          <p className={cn('text-xs mb-2', theme.textMuted)}>Participants:</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: participant.color }}
                />
                <span className={cn('text-sm flex-1', theme.textPrimary)}>
                  {participant.name}
                </span>
                {participant.isHost && (
                  <Crown className="w-3 h-3 text-yellow-400" />
                )}
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    participant.isConnected ? 'bg-green-500' : 'bg-gray-500'
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="text-xs">
                  <span className="font-medium text-blue-300">
                    {msg.participantName}:
                  </span>{' '}
                  <span className={theme.textSecondary}>{msg.content}</span>
                </div>
              ))
            ) : (
              <p className={cn('text-xs text-center', theme.textMuted)}>
                No messages yet
              </p>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-xs',
                  'bg-white/5 border border-white/10 text-white',
                  'placeholder-white/40',
                  'focus:outline-none focus:border-white/30'
                )}
              />
              <button
                onClick={handleSendMessage}
                className={cn(
                  'px-3 py-2 rounded-lg',
                  'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Leave Session */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={leaveSession}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs',
              'bg-red-500/20 hover:bg-red-500/30 text-red-300'
            )}
          >
            <LogOut className="w-3 h-3" />
            {isHost ? 'End Session' : 'Leave Session'}
          </button>
        </div>
      </div>
    )
  }

  // Create/Join View
  return (
    <div
      className={cn(
        'fixed top-20 left-4 z-40',
        'w-80 max-h-[500px] overflow-hidden flex flex-col',
        'rounded-xl border border-white/10',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Users className={cn('w-5 h-5', theme.textPrimary)} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Collaborative View
          </h3>
          {!isAvailable && (
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-yellow-500/20 text-yellow-300">
              Coming Soon
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
        >
          <X className={cn('w-4 h-4', theme.textSecondary)} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-yellow-300">{error}</p>
              <button
                onClick={clearError}
                className="text-[10px] text-yellow-400 hover:underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Selection */}
      {mode === 'none' && (
        <div className="p-4 space-y-3">
          <p className={cn('text-xs', theme.textMuted)}>
            View models together in real-time with others
          </p>

          <button
            onClick={() => setMode('create')}
            disabled={!currentCharacter}
            className={cn(
              'w-full flex items-center gap-3 p-4 rounded-lg',
              'bg-blue-500/10 border border-blue-500/30',
              'transition-colors',
              currentCharacter
                ? 'hover:bg-blue-500/20'
                : 'opacity-50 cursor-not-allowed'
            )}
          >
            <Video className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <p className={cn('text-sm font-medium', theme.textPrimary)}>
                Start Session
              </p>
              <p className={cn('text-xs', theme.textMuted)}>
                Host a collaborative viewing session
              </p>
            </div>
          </button>

          <button
            onClick={() => setMode('join')}
            className={cn(
              'w-full flex items-center gap-3 p-4 rounded-lg',
              'bg-white/5 border border-white/10',
              'hover:bg-white/10 transition-colors'
            )}
          >
            <UserPlus className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <p className={cn('text-sm font-medium', theme.textPrimary)}>
                Join Session
              </p>
              <p className={cn('text-xs', theme.textMuted)}>
                Enter a session code to join
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Create Session Form */}
      {mode === 'create' && (
        <div className="p-4 space-y-3">
          <p className={cn('text-xs', theme.textMuted)}>
            Creating session for: {currentCharacter?.name}
          </p>

          <button
            onClick={handleCreate}
            disabled={isConnecting}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-lg',
              'bg-blue-500/20 text-blue-300',
              isConnecting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-500/30'
            )}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Video className="w-4 h-4" />
            )}
            {isConnecting ? 'Creating...' : 'Create Session'}
          </button>

          <button
            onClick={() => setMode('none')}
            className={cn(
              'w-full py-2 rounded-lg text-xs',
              'bg-white/10 hover:bg-white/20',
              theme.textSecondary
            )}
          >
            Back
          </button>
        </div>
      )}

      {/* Join Session Form */}
      {mode === 'join' && (
        <div className="p-4 space-y-3">
          <div>
            <label className={cn('block text-xs mb-1', theme.textMuted)}>
              Session Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABCD12"
              maxLength={6}
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm text-center tracking-widest',
                'bg-white/5 border border-white/10 text-white',
                'placeholder-white/40 uppercase',
                'focus:outline-none focus:border-white/30'
              )}
            />
          </div>

          <div>
            <label className={cn('block text-xs mb-1', theme.textMuted)}>
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm',
                'bg-white/5 border border-white/10 text-white',
                'placeholder-white/40',
                'focus:outline-none focus:border-white/30'
              )}
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={isConnecting || !joinCode || !userName}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-lg',
              'bg-green-500/20 text-green-300',
              isConnecting || !joinCode || !userName
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-500/30'
            )}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {isConnecting ? 'Joining...' : 'Join Session'}
          </button>

          <button
            onClick={() => setMode('none')}
            className={cn(
              'w-full py-2 rounded-lg text-xs',
              'bg-white/10 hover:bg-white/20',
              theme.textSecondary
            )}
          >
            Back
          </button>
        </div>
      )}

      {/* Info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-start gap-2">
          <MessageSquare className={cn('w-4 h-4 flex-shrink-0', theme.textMuted)} />
          <p className={cn('text-xs', theme.textMuted)}>
            Collaborate in real-time: synchronized camera, live cursors, and chat.
          </p>
        </div>
      </div>
    </div>
  )
}
