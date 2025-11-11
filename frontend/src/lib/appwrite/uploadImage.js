import { ID, Permission, Role } from "appwrite"
import { storage, appwriteConfig } from "./config"

// Upload with public read
export async function uploadFile(file) {
  const res = await storage.createFile(
    appwriteConfig.storageId,
    ID.unique(),
    file,
    [Permission.read(Role.any())]
  )
  return res // contains $id
}

// Build a public URL (no transforms)
export function getFilePreviewUrl(fileId) {
  return storage.getFileView(appwriteConfig.storageId, fileId)
}

// If you already uploaded files, make them public:
export async function makePublic(fileId) {
  // Try new-style first; if it throws, use the older signature
  try {
    await storage.updateFile(appwriteConfig.storageId, fileId, {
      permissions: [Permission.read(Role.any())]
    })
  } catch {
    await storage.updateFile(
      appwriteConfig.storageId,
      fileId,
      [Permission.read(Role.any())]
    )
  }
}
