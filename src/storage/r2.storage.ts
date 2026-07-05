import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = 'riri-documents';

export async function uploadFileToR2(
  file: Express.Multer.File,
  folder: string,
): Promise<string> {
  // ← create client here, inside the function, so env vars are loaded first
  const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
    },
  });

  const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
  const key = `${folder}/${filename}`;

  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}