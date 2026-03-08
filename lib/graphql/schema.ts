export const typeDefs = /* GraphQL */ `
  scalar JSON
  scalar DateTime

  type File {
    id: ID!
    name: String!
    path: String!
    size: Int!
    type: String!
    fileUrl: String!
    thumbnailUrl: String
    userId: String!
    parentId: ID
    isFolder: Boolean!
    isStarred: Boolean!
    isTrash: Boolean!
    tags: [String!]
    aiDescription: String
    contentHash: String
    createdAt: DateTime!
    updatedAt: DateTime!
    lastAccessedAt: DateTime
    children: [File!]
  }

  type ActivityLog {
    id: ID!
    userId: String!
    fileId: ID
    fileName: String
    action: String!
    details: JSON
    createdAt: DateTime!
  }

  type FileTypeStats {
    count: Int!
    size: Int!
  }

  type FileTypeBreakdown {
    images: FileTypeStats!
    documents: FileTypeStats!
    videos: FileTypeStats!
    audio: FileTypeStats!
    others: FileTypeStats!
  }

  type RecentActivity {
    today: Int!
    thisWeek: Int!
    thisMonth: Int!
  }

  type StorageAnalytics {
    totalSize: Int!
    totalFiles: Int!
    storageLimit: Float!
    fileTypeBreakdown: FileTypeBreakdown!
    recentActivity: RecentActivity!
  }

  type DuplicateGroup {
    contentHash: String!
    count: Int!
    files: [File!]!
  }

  type DuplicatesResult {
    duplicates: [DuplicateGroup!]!
    totalGroups: Int!
  }

  type MutationResult {
    success: Boolean!
    message: String
  }

  type Query {
    files(parentId: ID): [File!]!
    file(id: ID!): File
    starredFiles: [File!]!
    trashedFiles: [File!]!
    duplicates: DuplicatesResult!
    storageAnalytics: StorageAnalytics!
    activityLogs(limit: Int): [ActivityLog!]!
  }

  type Mutation {
    starFile(id: ID!): File!
    trashFile(id: ID!): File!
    deleteFile(id: ID!): MutationResult!
    createFolder(name: String!, parentId: ID): File!
    emptyTrash: MutationResult!
  }
`;
