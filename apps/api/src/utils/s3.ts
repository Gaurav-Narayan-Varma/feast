import * as pdfLibFontkit from "@pdf-lib/fontkit";
import * as AWS from "aws-sdk";
import * as path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib/cjs";
import * as sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { ALLOWED_ORIGINS } from "../../src/constants";

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

export enum S3Prefix {
  PROFILE_PICTURES = "profile-pictures",
  GALLERY_PICTURES = "gallery-pictures",
  RECIPE_IMAGES = "recipe-images",
  CONTRACTS_1099 = "1099-contracts",
}

// Image quality variants
export enum ImageQuality {
  ORIGINAL = "original",
  LARGE = "large", // 1200px wide - good for full screen
  MEDIUM = "medium", // 600px wide - good for thumbnails
  THUMBNAIL = "thumbnail", // 200x200px - good for avatars
}

// Configuration for different image quality variants
export interface ImageVariantConfig {
  width: number | null;
  height: number | null;
  webpQuality: number;
  fit: "inside" | "cover" | "contain" | "fill" | "outside";
}

export const imageVariantConfigs: Record<
  Exclude<ImageQuality, ImageQuality.ORIGINAL>,
  ImageVariantConfig
> = {
  [ImageQuality.LARGE]: {
    width: 1200,
    height: null,
    webpQuality: 85,
    fit: "inside",
  },
  [ImageQuality.MEDIUM]: {
    width: 600,
    height: null,
    webpQuality: 80,
    fit: "inside",
  },
  [ImageQuality.THUMBNAIL]: {
    width: 200,
    height: 200,
    webpQuality: 75,
    fit: "inside",
  },
};

export const getSignedUrl = async (key: string): Promise<string> => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 60 * 60 * 6, // 6 hours
    };

    return s3.getSignedUrl("getObject", params);
  } catch (error) {
    throw new Error("Error generating signed URL:");
  }
};

/**
 * Extract the base key (without extension) from a full S3 key
 * @param key The full S3 key
 * @returns The key without extension
 */
export const getKeyWithoutExtension = (key: string): string => {
  const lastDotIndex = key.lastIndexOf(".");
  return lastDotIndex !== -1 ? key.substring(0, lastDotIndex) : key;
};

/**
 * Get the extension from a key
 * @param key The full S3 key
 * @returns The extension including the dot (e.g., '.jpg')
 */
export const getExtensionFromKey = (key: string): string => {
  const lastDotIndex = key.lastIndexOf(".");
  return lastDotIndex !== -1 ? key.substring(lastDotIndex) : "";
};

/**
 * Construct a key for a specific image quality variant
 * @param baseKey The base key (with or without extension)
 * @param quality The image quality variant
 * @returns The constructed S3 key for the specified quality
 */
export const constructQualityVariantKey = (
  baseKey: string,
  quality: ImageQuality
): string => {
  const keyWithoutExt = getKeyWithoutExtension(baseKey);
  const extension =
    quality === ImageQuality.ORIGINAL
      ? getExtensionFromKey(baseKey) || ".jpg" // Keep original extension or default to jpg
      : ".webp"; // Use webp for other qualities

  return `${keyWithoutExt}_${quality}${extension}`;
};

/**
 * Generate a signed URL for a specific image quality variant
 * @param baseKey The base key without quality suffix
 * @param quality The image quality variant to retrieve
 * @returns Promise resolving to the signed URL for the requested quality
 */
export const getImageSignedUrl = async (
  baseKey: string,
  quality: ImageQuality = ImageQuality.LARGE
): Promise<string> => {
  try {
    // Construct the key with quality suffix
    const qualityKey = constructQualityVariantKey(baseKey, quality);

    return await getSignedUrl(qualityKey);
  } catch (error) {
    // Try to fall back to original image if specific quality fails
    if (quality !== ImageQuality.ORIGINAL) {
      try {
        return await getImageSignedUrl(baseKey, ImageQuality.ORIGINAL);
      } catch (fallbackError) {
        throw new Error("Error generating image URL:");
      }
    }
    throw new Error("Error generating image URL:");
  }
};

/**
 * Uploads data to S3
 * @param data The data to upload - can be a Buffer, Readable stream, or string
 * @param key The S3 key (path) where to store the data
 * @param contentType Optional MIME type of the data
 * @param metadata Optional metadata to attach to the object
 * @returns Promise that resolves to the S3 upload response
 */
export const uploadToS3 = async (
  data: string | Buffer | Uint8Array | ReadableStream,
  key: string,
  contentType?: string,
  metadata?: Record<string, string>
): Promise<AWS.S3.ManagedUpload.SendData> => {
  try {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: data,
      ...(contentType && { ContentType: contentType }),
      ...(metadata && { Metadata: metadata }),
    };

    return await s3.upload(params).promise();
  } catch (error) {
    throw new Error("Error uploading data to S3:");
  }
};

/**
 * Create an optimized image variant with specified configuration
 * @param sharpInstance A sharp instance with the source image loaded
 * @param variantConfig Configuration parameters for this variant
 * @returns Promise resolving to a Buffer containing the optimized image
 */
export const createImageVariant = async (
  sharpInstance: sharp.Sharp,
  variantConfig: ImageVariantConfig
): Promise<Buffer> => {
  return sharpInstance
    .clone()
    .resize(variantConfig.width, variantConfig.height, {
      fit: variantConfig.fit,
    })
    .webp({ quality: variantConfig.webpQuality })
    .toBuffer();
};

/**
 * Helper function to upload an image to S3 with multiple quality variants
 * @param file Express.Multer.File from multer middleware (should be an image)
 * @param baseKey The base S3 key (path) where to store the file
 * @param metadata Optional metadata to attach to the object
 * @returns Promise resolving to a record of keys for each quality variant
 */
export const uploadImageToS3 = async (
  file: Express.Multer.File,
  baseKey: string,
  metadata?: Record<string, string>
): Promise<Record<ImageQuality, string>> => {
  // Validate that this is an image file
  if (!file.mimetype.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  const fileExt = path.extname(baseKey).toLowerCase();
  const isAnimated = fileExt === ".gif"; // Don't process animated GIFs

  // Prepare base key without extension
  const keyWithoutExt = getKeyWithoutExtension(baseKey);

  // Object to store all uploaded keys by quality
  const result: Record<ImageQuality, string> = {} as Record<
    ImageQuality,
    string
  >;

  try {
    // 1. Upload the original image first
    const originalKey = constructQualityVariantKey(
      baseKey,
      ImageQuality.ORIGINAL
    );
    await uploadToS3(file.buffer, originalKey, file.mimetype, metadata);
    result[ImageQuality.ORIGINAL] = originalKey;

    // Skip additional processing for animated GIFs
    if (isAnimated) {
      // Use original for all variants
      result[ImageQuality.LARGE] = originalKey;
      result[ImageQuality.MEDIUM] = originalKey;
      result[ImageQuality.THUMBNAIL] = originalKey;
      return result;
    }

    // Initialize Sharp with the image buffer
    const sharpImage = sharp(file.buffer).rotate(); // Auto-rotate based on EXIF

    // Process each variant in parallel
    const variantPromises = Object.entries(imageVariantConfigs).map(
      async ([quality, config]) => {
        const typedQuality = quality as Exclude<
          ImageQuality,
          ImageQuality.ORIGINAL
        >;
        const buffer = await createImageVariant(sharpImage, config);
        const key = constructQualityVariantKey(baseKey, typedQuality);
        await uploadToS3(buffer, key, "image/webp", metadata);
        result[typedQuality] = key;
      }
    );

    await Promise.all(variantPromises);

    return result;
  } catch (error) {
    throw new Error("Error uploading and processing image:");
  }
};

/**
 * Helper function to upload a Multer file to S3
 * @param file Express.Multer.File from multer middleware
 * @param key The S3 key (path) where to store the file
 * @param metadata Optional metadata to attach to the object
 * @returns Promise that resolves to the S3 upload response
 * @deprecated Use uploadImageToS3 for images instead
 */
export const uploadFileToS3 = async (
  file: Express.Multer.File,
  key: string,
  metadata?: Record<string, string>
): Promise<AWS.S3.ManagedUpload.SendData> => {
  return uploadToS3(file.buffer, key, file.mimetype, metadata);
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    throw new Error("Error deleting file from S3:");
  }
};

/**
 * Extract the base part of a key without any quality suffix
 * @param key The full S3 key (with or without quality suffix)
 * @returns The base part of the key without quality suffix or extension
 */
export const extractBaseKeyPart = (key: string): string => {
  let basePart = key;

  // Remove quality suffix if present
  Object.values(ImageQuality).forEach((quality) => {
    const suffixPattern = new RegExp(`_${quality}\\.[^.]+$`);
    if (suffixPattern.test(basePart)) {
      basePart = basePart.replace(suffixPattern, "");
    }
  });

  // If no quality suffix found, just remove the extension
  if (basePart === key) {
    basePart = getKeyWithoutExtension(basePart);
  }

  return basePart;
};

/**
 * Delete all quality variants of an image from S3
 * @param baseKey Any key variant of the image (with or without quality suffix)
 */
export const deleteImageVariants = async (baseKey: string): Promise<void> => {
  try {
    // Extract the base part without any quality suffix and extension
    const basePart = extractBaseKeyPart(baseKey);

    // List all objects with this base prefix to find all variants
    const listParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: basePart,
    };

    const response = await s3.listObjectsV2(listParams).promise();

    if (!response.Contents || response.Contents.length === 0) {
      // No variants found, try deleting the original key
      await deleteFromS3(baseKey);
      return;
    }

    // Delete all found objects in parallel
    await Promise.all(
      response.Contents.filter((item) => item.Key).map((item) =>
        deleteFromS3(item.Key!)
      )
    );
  } catch (error) {
    throw new Error("Error deleting image variants:");
  }
};

export const generateS3Key = (
  prefix: S3Prefix,
  filename: string,
  ownerId?: string
): string => {
  const fileExtension = filename.split(".").pop()?.toLowerCase() || "";
  const uuid = uuidv4();

  if (ownerId) {
    return `${prefix}/${ownerId}/${uuid}.${fileExtension}`;
  }

  return `${prefix}/${uuid}.${fileExtension}`;
};

/**
 * Configure CORS settings for the S3 bucket
 * @returns Promise that resolves when CORS is configured
 */
export const configureBucketCORS = async (): Promise<void> => {
  try {
    const corsParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
            AllowedOrigins: ALLOWED_ORIGINS,
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    };

    await s3.putBucketCors(corsParams).promise();
  } catch (error) {
    throw new Error("Error configuring S3 CORS:");
  }
};

/**
 * Check current CORS configuration for the S3 bucket
 * @returns Promise that resolves to the current CORS configuration
 */
export const getBucketCORS = async (): Promise<AWS.S3.GetBucketCorsOutput> => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
    };

    return await s3.getBucketCors(params).promise();
  } catch (error) {
    throw new Error("Error getting S3 CORS configuration:");
  }
};

export async function generateSigned1099Pdf(
  effectiveDate: string,
  legalName: string
) {
  /**
   * Fetch the PDF template from the frontend public URL
   */
  const response = await fetch(`${process.env.FEAST_WEB_URL}/1099.pdf`);
  const pdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Register font support for cursive-style text
  pdfDoc.registerFontkit(pdfLibFontkit);

  // Get all pages
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];
  const firstPage = pages[0];

  const replacements = {
    "@@EffectiveDate": effectiveDate,
    "@@SigningChef": legalName,
    "@@Signature": legalName, // Will appear like a signature
    "@@Date": effectiveDate,
  };
  // Embed a standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const signatureFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic); // or Helvetica-Oblique for a more signature-like look

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const effectiveDatePositions: Record<string, { x: number; y: number }> = {
      "@@EffectiveDate": { x: 150, y: 665 },
    };
    Object.entries(replacements).forEach(([placeholder, value]) => {
      if (effectiveDatePositions[placeholder]) {
        firstPage.drawText(value, {
          x: effectiveDatePositions[placeholder].x,
          y: effectiveDatePositions[placeholder].y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    });
    // Define positions where placeholders exist (manually adjust based on your PDF layout)
    const positions: Record<string, { x: number; y: number }> = {
      "@@SigningChef": { x: 150, y: 655 },
      "@@Signature": { x: 150, y: 625 },
      "@@Date": { x: 150, y: 600 },
    };
    Object.entries(replacements).forEach(([placeholder, value]) => {
      if (positions[placeholder]) {
        lastPage.drawText(value, {
          x: positions[placeholder].x,
          y: positions[placeholder].y,
          size: 12,
          font: placeholder === "@@Signature" ? signatureFont : font, // Different font for signature
          color: placeholder === "@@Signature" ? rgb(0, 0, 1) : rgb(0, 0, 0), // Blue color for signature
        });
      }
    });
  });

  return await pdfDoc.save();
}
