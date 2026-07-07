// =============================================================================
// CLOUDINARY - File Upload Service
// =============================================================================
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export interface UploadResult {
    url: string;
    publicId: string;
    format: string;
    sizeBytes: number;
    width?: number;
    height?: number;
}

/**
 * Upload a base64-encoded file or a file URL to Cloudinary.
 * @param fileData  - base64 string (data:image/png;base64,...) or HTTP URL
 * @param folder    - Cloudinary folder path
 * @param resourceType - "image" | "video" | "raw" | "auto"
 */
export async function uploadToCloudinary(
    fileData: string,
    options: {
        folder?: string;
        public_id?: string;
        resource_type?: "image" | "video" | "raw" | "auto";
        transformation?: object[];
    } = {}
): Promise<UploadResult> {
    const result = await cloudinary.uploader.upload(fileData, {
        folder: options.folder ?? "agrisaas",
        resource_type: options.resource_type ?? "auto",
        public_id: options.public_id,
        transformation: options.transformation,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        sizeBytes: result.bytes,
        width: result.width,
        height: result.height,
    };
}

/** Delete a file from Cloudinary by its public ID */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

/** Generate a signed URL for private/protected assets */
export function getSignedUrl(publicId: string, expiresIn = 3600): string {
    return cloudinary.utils.private_download_url(publicId, "png", {
        expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    });
}
