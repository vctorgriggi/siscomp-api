const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = require("../config/aws");

async function deleteFromS3(fileUrl) {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const key = fileUrl.split("/").slice(3).join("/");

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3.send(command);
  } catch (error) {
    console.warn("Occurred an error while deleting the file from S3:", error);
  }
}

module.exports = deleteFromS3;
