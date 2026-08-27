"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToR2 = uploadFileToR2;
const client_s3_1 = require("@aws-sdk/client-s3");
const BUCKET = 'riri-documents';
async function uploadFileToR2(file, folder) {
    console.log('R2 ENV CHECK:', {
        account: process.env.CLOUDFLARE_ACCOUNT_ID,
        key: process.env.CLOUDFLARE_R2_ACCESS_KEY,
        secret: process.env.CLOUDFLARE_R2_SECRET_KEY ? 'set' : 'undefined',
        url: process.env.CLOUDFLARE_R2_PUBLIC_URL,
    });
    const r2 = new client_s3_1.S3Client({
        region: 'auto',
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
            secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
        },
    });
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const key = `${folder}/${filename}`;
    await r2.send(new client_s3_1.PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));
    return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}
//# sourceMappingURL=r2.storage.js.map