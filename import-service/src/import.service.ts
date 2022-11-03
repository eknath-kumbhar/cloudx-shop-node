import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import csvParser from "csv-parser";

export class ImportService {
    constructor() { }

    getS3Client(): S3Client {
        return new S3Client({ region: process.env.REGION });
    }

    async uploadToS3(name: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const s3Client = this.getS3Client();
                const bucketParams = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: `uploaded/${name}`,
                    ContentType: "text/csv",
                };
                const command = new PutObjectCommand(bucketParams);
                const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                resolve(signedUrl)
            } catch (error) {
                reject(error)
            }
        })
    }

    async streamToString(stream) {
        return new Promise((resolve, reject) => {
            console.log("streaming file");
            const chunks = [];
            stream
                .pipe(csvParser())
                .on("data", (chunk) => chunks.push(chunk))
                .on("error", reject)
                .on("end", () => resolve(JSON.stringify(chunks, null, 2)));
        });
    }
}