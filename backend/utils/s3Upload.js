const{ S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

async function generateUploadUrl(fileName, fileType) {
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `assets/${uniqueFileName}`,
        ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn:600 });

    return{
        signedUrl,
        fileName: uniqueFileName,
    };
    module.exports = {generateUploadUrl};
    
}