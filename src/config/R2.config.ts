import config from "./config";
import {
  S3Client,
  //ListBucketsCommand,
  //ListObjectsV2Command,
  //GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const S3 = new S3Client({
  region: "auto",
  endpoint: config.CLOUD.URL,
  credentials: {
    accessKeyId: config.CLOUD.ID,
    secretAccessKey: config.CLOUD.TOKEN,
  },
});

export const uploadImageToS3 = async (
  file: Buffer,
  prefix: string,
  nameFile: string
) => {
  const input = {
    Bucket: config.CLOUD.BUCKET,
    Key: `${prefix}/${nameFile}`,
    Body: file,
  };
  const command = new PutObjectCommand(input);

  try {
    const response = await S3.send(command);
    return {
      resp: response,
      url: `${config.CLOUD.URL_DEV}${prefix}/${nameFile}`,
      error: null,
    };
  } catch (error) {
    return { resp: null, error: error, url:null };
  }
};
