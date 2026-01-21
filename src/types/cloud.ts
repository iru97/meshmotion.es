/**
 * Phase 4: SCALE IT - Cloud Integration Types
 * These types define the API contracts for backend integration
 */

// ============================================
// Cloud Storage Integration
// ============================================

export type CloudProvider = 'google-drive' | 'dropbox' | 'onedrive' | 'local'

export interface CloudProviderConfig {
  id: CloudProvider
  name: string
  icon: string
  connected: boolean
  email?: string
  quota?: {
    used: number
    total: number
  }
}

export interface CloudFile {
  id: string
  name: string
  path: string
  provider: CloudProvider
  size: number
  mimeType: string
  thumbnailUrl?: string
  downloadUrl?: string
  createdAt: string
  modifiedAt: string
  isFolder: boolean
  parentId?: string
}

export interface CloudFolder extends CloudFile {
  isFolder: true
  children?: CloudFile[]
}

export interface CloudStorageState {
  providers: CloudProviderConfig[]
  currentProvider: CloudProvider | null
  currentFolder: string | null
  files: CloudFile[]
  isLoading: boolean
  error: string | null
  searchQuery: string
}

export interface CloudStorageAPI {
  // Authentication
  connect: (provider: CloudProvider) => Promise<boolean>
  disconnect: (provider: CloudProvider) => Promise<void>
  getAuthUrl: (provider: CloudProvider) => string

  // File Operations
  listFiles: (provider: CloudProvider, folderId?: string) => Promise<CloudFile[]>
  uploadFile: (provider: CloudProvider, file: File, folderId?: string) => Promise<CloudFile>
  downloadFile: (provider: CloudProvider, fileId: string) => Promise<Blob>
  deleteFile: (provider: CloudProvider, fileId: string) => Promise<void>
  moveFile: (provider: CloudProvider, fileId: string, newFolderId: string) => Promise<CloudFile>

  // Folder Operations
  createFolder: (provider: CloudProvider, name: string, parentId?: string) => Promise<CloudFolder>

  // Search
  searchFiles: (provider: CloudProvider, query: string) => Promise<CloudFile[]>
}

// ============================================
// Temporary Link Storage
// ============================================

export type LinkExpiry = '1h' | '24h' | '7d' | '30d' | 'never'

export interface TemporaryLink {
  id: string
  shortCode: string
  fullUrl: string
  shortUrl: string
  modelName: string
  modelSize: number
  thumbnailUrl?: string
  viewerSettings: ViewerLinkSettings
  createdAt: string
  expiresAt: string | null
  expiry: LinkExpiry
  viewCount: number
  isActive: boolean
  password?: string
}

export interface ViewerLinkSettings {
  autoplay: boolean
  hideUI: boolean
  backgroundColor: string
  cameraPosition?: [number, number, number]
  animationName?: string
  lightingPreset?: string
  environmentPreset?: string
}

export interface CreateLinkRequest {
  modelFile: File | Blob
  modelName: string
  expiry: LinkExpiry
  settings: ViewerLinkSettings
  password?: string
}

export interface TemporaryLinksState {
  links: TemporaryLink[]
  isUploading: boolean
  uploadProgress: number
  isLoading: boolean
  error: string | null
}

export interface TemporaryLinksAPI {
  createLink: (request: CreateLinkRequest) => Promise<TemporaryLink>
  getLink: (shortCode: string) => Promise<TemporaryLink | null>
  deleteLink: (id: string) => Promise<void>
  updateLink: (id: string, updates: Partial<TemporaryLink>) => Promise<TemporaryLink>
  listMyLinks: () => Promise<TemporaryLink[]>
  extendExpiry: (id: string, newExpiry: LinkExpiry) => Promise<TemporaryLink>
}

// ============================================
// Collaborative Viewing
// ============================================

export interface CollaborativeSession {
  id: string
  code: string // Short code for joining
  hostId: string
  hostName: string
  modelName: string
  modelUrl: string
  participants: Participant[]
  settings: SessionSettings
  createdAt: string
  isActive: boolean
}

export interface Participant {
  id: string
  name: string
  color: string
  isHost: boolean
  cursor?: CursorPosition
  cameraPosition?: [number, number, number]
  cameraTarget?: [number, number, number]
  joinedAt: string
  isConnected: boolean
}

export interface CursorPosition {
  worldPosition: [number, number, number]
  screenPosition: [number, number]
  timestamp: number
}

export interface SessionSettings {
  allowCameraSync: boolean
  allowAnnotations: boolean
  allowChat: boolean
  maxParticipants: number
  requireApproval: boolean
}

export interface ChatMessage {
  id: string
  participantId: string
  participantName: string
  content: string
  timestamp: string
  type: 'text' | 'annotation' | 'system'
}

export interface CollaborativeState {
  currentSession: CollaborativeSession | null
  isHost: boolean
  isConnecting: boolean
  isConnected: boolean
  participants: Participant[]
  messages: ChatMessage[]
  error: string | null
  localParticipant: Participant | null
}

export interface CollaborativeAPI {
  // Session Management
  createSession: (modelUrl: string, settings?: Partial<SessionSettings>) => Promise<CollaborativeSession>
  joinSession: (code: string, name: string) => Promise<CollaborativeSession>
  leaveSession: () => Promise<void>
  endSession: () => Promise<void>

  // Real-time Updates
  syncCamera: (position: [number, number, number], target: [number, number, number]) => void
  updateCursor: (position: CursorPosition) => void
  sendMessage: (content: string) => void

  // Participant Management
  kickParticipant: (participantId: string) => Promise<void>
  approveParticipant: (participantId: string) => Promise<void>
}

// ============================================
// Gallery & Profile Pages
// ============================================

export interface UserProfile {
  id: string
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  coverUrl?: string
  website?: string
  socialLinks: SocialLinks
  isVerified: boolean
  isPro: boolean
  createdAt: string
  stats: ProfileStats
}

export interface SocialLinks {
  twitter?: string
  instagram?: string
  artstation?: string
  github?: string
  linkedin?: string
}

export interface ProfileStats {
  totalModels: number
  totalViews: number
  totalLikes: number
  followers: number
  following: number
}

export interface GalleryModel {
  id: string
  name: string
  description?: string
  thumbnailUrl: string
  previewUrl?: string // Animated GIF/video preview
  modelUrl: string
  authorId: string
  author: UserProfile
  tags: string[]
  category: ModelCategory
  license: ModelLicense
  viewCount: number
  likeCount: number
  commentCount: number
  downloadCount: number
  isPublic: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  stats: ModelStats
}

export interface ModelStats {
  vertices: number
  triangles: number
  materials: number
  textures: number
  animations: number
  fileSize: number
}

export type ModelCategory =
  | 'characters'
  | 'vehicles'
  | 'architecture'
  | 'nature'
  | 'props'
  | 'weapons'
  | 'animals'
  | 'food'
  | 'furniture'
  | 'electronics'
  | 'other'

export type ModelLicense =
  | 'cc0'          // Public Domain
  | 'cc-by'        // Attribution
  | 'cc-by-sa'     // Attribution-ShareAlike
  | 'cc-by-nc'     // Attribution-NonCommercial
  | 'cc-by-nc-sa'  // Attribution-NonCommercial-ShareAlike
  | 'personal'     // Personal use only
  | 'editorial'    // Editorial use only
  | 'custom'       // Custom license

export interface Collection {
  id: string
  name: string
  description?: string
  coverUrl?: string
  authorId: string
  author: UserProfile
  models: GalleryModel[]
  modelCount: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  modelId: string
  authorId: string
  author: UserProfile
  content: string
  createdAt: string
  updatedAt?: string
  likes: number
  replies: Comment[]
}

export interface GalleryState {
  featuredModels: GalleryModel[]
  recentModels: GalleryModel[]
  popularModels: GalleryModel[]
  searchResults: GalleryModel[]
  currentModel: GalleryModel | null
  currentProfile: UserProfile | null
  myProfile: UserProfile | null
  myModels: GalleryModel[]
  myCollections: Collection[]
  isLoading: boolean
  error: string | null
}

export interface GalleryAPI {
  // Models
  getFeatured: () => Promise<GalleryModel[]>
  getRecent: (page?: number, limit?: number) => Promise<GalleryModel[]>
  getPopular: (timeRange?: 'day' | 'week' | 'month' | 'all') => Promise<GalleryModel[]>
  getModel: (id: string) => Promise<GalleryModel>
  searchModels: (query: string, filters?: SearchFilters) => Promise<GalleryModel[]>
  uploadModel: (data: UploadModelRequest) => Promise<GalleryModel>
  updateModel: (id: string, data: Partial<GalleryModel>) => Promise<GalleryModel>
  deleteModel: (id: string) => Promise<void>
  likeModel: (id: string) => Promise<void>
  unlikeModel: (id: string) => Promise<void>

  // Profiles
  getProfile: (username: string) => Promise<UserProfile>
  getMyProfile: () => Promise<UserProfile>
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>
  followUser: (userId: string) => Promise<void>
  unfollowUser: (userId: string) => Promise<void>

  // Collections
  createCollection: (data: CreateCollectionRequest) => Promise<Collection>
  updateCollection: (id: string, data: Partial<Collection>) => Promise<Collection>
  deleteCollection: (id: string) => Promise<void>
  addToCollection: (collectionId: string, modelId: string) => Promise<void>
  removeFromCollection: (collectionId: string, modelId: string) => Promise<void>

  // Comments
  getComments: (modelId: string) => Promise<Comment[]>
  addComment: (modelId: string, content: string) => Promise<Comment>
  deleteComment: (commentId: string) => Promise<void>
}

export interface SearchFilters {
  category?: ModelCategory
  license?: ModelLicense
  animated?: boolean
  minVertices?: number
  maxVertices?: number
  tags?: string[]
  author?: string
  sortBy?: 'recent' | 'popular' | 'views' | 'downloads'
}

export interface UploadModelRequest {
  file: File
  name: string
  description?: string
  tags: string[]
  category: ModelCategory
  license: ModelLicense
  isPublic: boolean
}

export interface CreateCollectionRequest {
  name: string
  description?: string
  isPublic: boolean
}

// ============================================
// Default States
// ============================================

export const DEFAULT_CLOUD_STORAGE_STATE: CloudStorageState = {
  providers: [
    { id: 'google-drive', name: 'Google Drive', icon: 'google', connected: false },
    { id: 'dropbox', name: 'Dropbox', icon: 'dropbox', connected: false },
    { id: 'onedrive', name: 'OneDrive', icon: 'microsoft', connected: false },
  ],
  currentProvider: null,
  currentFolder: null,
  files: [],
  isLoading: false,
  error: null,
  searchQuery: '',
}

export const DEFAULT_TEMPORARY_LINKS_STATE: TemporaryLinksState = {
  links: [],
  isUploading: false,
  uploadProgress: 0,
  isLoading: false,
  error: null,
}

export const DEFAULT_COLLABORATIVE_STATE: CollaborativeState = {
  currentSession: null,
  isHost: false,
  isConnecting: false,
  isConnected: false,
  participants: [],
  messages: [],
  error: null,
  localParticipant: null,
}

export const DEFAULT_GALLERY_STATE: GalleryState = {
  featuredModels: [],
  recentModels: [],
  popularModels: [],
  searchResults: [],
  currentModel: null,
  currentProfile: null,
  myProfile: null,
  myModels: [],
  myCollections: [],
  isLoading: false,
  error: null,
}
