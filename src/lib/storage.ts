/**
 * File Storage System
 * Supports local storage, AWS S3, and Cloudinary
 */

import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import crypto from "crypto"

export type StorageProvider = "local" | "s3" | "cloudinary"

interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

interface StorageConfig {
  provider: StorageProvider
  // Local storage
  localPath?: string
  // S3
  s3Bucket?: string
  s3Region?: string
  s3AccessKey?: string
  s3SecretKey?: string
  // Cloudinary
  cloudinaryCloudName?: string
  cloudinaryApiKey?: string
  cloudinaryApiSecret?: string
}

const config: StorageConfig = {
  provider: (process.env.STORAGE_PROVIDER as StorageProvider) || "local",
  localPath: process.env.LOCAL_STORAGE_PATH || "./uploads",
  s3Bucket: process.env.AWS_S3_BUCKET,
  s3Region: process.env.AWS_REGION,
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
}

/**
 * Generate unique filename
 */
function generateFilename(originalName: string): string {
  const ext = originalName.split(".").pop() || "file"
  const hash = crypto.randomBytes(16).toString("hex")
  const timestamp = Date.now()
  return `${timestamp}-${hash}.${ext}`
}

/**
 * Validate file type
 */
export function validateFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  return allowedTypes.includes(ext)
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSizeMB: number): boolean {
  return size <= maxSizeMB * 1024 * 1024
}

/**
 * Upload to local storage
 */
async function uploadLocal(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<UploadResult> {
  try {
    const uploadDir = join(config.localPath!, folder)
    await mkdir(uploadDir, { recursive: true })

    const uniqueFilename = generateFilename(filename)
    const filepath = join(uploadDir, uniqueFilename)

    await writeFile(filepath, buffer)

    return {
      success: true,
      url: `/uploads/${folder}/${uniqueFilename}`,
      key: `${folder}/${uniqueFilename}`,
    }
  } catch (error) {
    console.error("Local upload error:", error)
    return {
      success: false,
      error: "Failed to upload file locally",
    }
  }
}

/**
 * Upload to AWS S3
 */
async function uploadS3(
  buffer: Buffer,
  filename: string,
  folder: string,
  contentType: string
): Promise<UploadResult> {
  try {
    // Dynamic import for S3 client
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3")

    const client = new S3Client({
      region: config.s3Region,
      credentials: {
        accessKeyId: config.s3AccessKey!,
        secretAccessKey: config.s3SecretKey!,
      },
    })

    const uniqueFilename = generateFilename(filename)
    const key = `${folder}/${uniqueFilename}`

    await client.send(
      new PutObjectCommand({
        Bucket: config.s3Bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )

    return {
      success: true,
      url: `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/${key}`,
      key,
    }
  } catch (error) {
    console.error("S3 upload error:", error)
    return {
      success: false,
      error: "Failed to upload file to S3",
    }
  }
}

/**
 * Upload to Cloudinary
 */
async function uploadCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<UploadResult> {
  try {
    const { v2: cloudinary } = await import("cloudinary")

    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
    })

    const base64 = buffer.toString("base64")
    const dataURI = `data:application/octet-stream;base64,${base64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `pharmplus/${folder}`,
      resource_type: "auto",
    })

    return {
      success: true,
      url: result.secure_url,
      key: result.public_id,
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return {
      success: false,
      error: "Failed to upload file to Cloudinary",
    }
  }
}

/**
 * Main upload function
 */
export async function uploadFile(
  file: File | Buffer,
  options: {
    filename: string
    folder: string
    contentType?: string
    allowedTypes?: string[]
    maxSizeMB?: number
  }
): Promise<UploadResult> {
  const {
    filename,
    folder,
    contentType = "application/octet-stream",
    allowedTypes = ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    maxSizeMB = 10,
  } = options

  // Validate file type
  if (!validateFileType(filename, allowedTypes)) {
    return {
      success: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
    }
  }

  // Get buffer from file
  let buffer: Buffer
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer()
    buffer = Buffer.from(arrayBuffer)
  } else {
    buffer = file
  }

  // Validate file size
  if (!validateFileSize(buffer.length, maxSizeMB)) {
    return {
      success: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    }
  }

  // Upload based on provider
  switch (config.provider) {
    case "s3":
      return uploadS3(buffer, filename, folder, contentType)
    case "cloudinary":
      return uploadCloudinary(buffer, filename, folder)
    case "local":
    default:
      return uploadLocal(buffer, filename, folder)
  }
}

/**
 * Delete file
 */
export async function deleteFile(key: string): Promise<boolean> {
  try {
    switch (config.provider) {
      case "s3": {
        const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3")
        const client = new S3Client({
          region: config.s3Region,
          credentials: {
            accessKeyId: config.s3AccessKey!,
            secretAccessKey: config.s3SecretKey!,
          },
        })
        await client.send(
          new DeleteObjectCommand({
            Bucket: config.s3Bucket,
            Key: key,
          })
        )
        return true
      }
      case "cloudinary": {
        const { v2: cloudinary } = await import("cloudinary")
        cloudinary.config({
          cloud_name: config.cloudinaryCloudName,
          api_key: config.cloudinaryApiKey,
          api_secret: config.cloudinaryApiSecret,
        })
        await cloudinary.uploader.destroy(key)
        return true
      }
      case "local":
      default: {
        const filepath = join(config.localPath!, key)
        await unlink(filepath)
        return true
      }
    }
  } catch (error) {
    console.error("Delete file error:", error)
    return false
  }
}

/**
 * Get signed URL for private files (S3 only)
 */
export async function getSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string | null> {
  if (config.provider !== "s3") {
    return null
  }

  try {
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3")
    const { getSignedUrl: s3GetSignedUrl } = await import("@aws-sdk/s3-request-presigner")

    const client = new S3Client({
      region: config.s3Region,
      credentials: {
        accessKeyId: config.s3AccessKey!,
        secretAccessKey: config.s3SecretKey!,
      },
    })

    const command = new GetObjectCommand({
      Bucket: config.s3Bucket,
      Key: key,
    })

    return await s3GetSignedUrl(client, command, { expiresIn })
  } catch (error) {
    console.error("Get signed URL error:", error)
    return null
  }
}
