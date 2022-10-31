import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { formatJSONResponse } from '@libs/api-gateway';
import { ImportService } from 'src/import.service';

const importFileParser = async (event) => {
  try {
    console.log("runned, ", event);
    const { awsRegion, s3: { bucket, object: s3Object } } = event.Records[0];
    console.log(s3Object);
    
    const s3Client = new S3Client({ region: awsRegion });
    const importService = new ImportService()
    
    const bucketParams = {
      Bucket: bucket.name,
      Key: s3Object.key,
    };
    const command = new GetObjectCommand(bucketParams);
    const streamData = await s3Client.send(command);

    console.log("STREAM DATA =>, ", streamData);
    const data = await importService.streamToString(streamData.Body);
    console.log("PARSED DATA: ", data);

    console.log("coping file");
    await s3Client.send(
      new CopyObjectCommand({
        ...bucketParams,
        CopySource: `${bucketParams.Bucket}/${bucketParams.Key}`,
        Key: bucketParams.Key.replace("uploaded", "parsed"),
      })
    );

    console.log("deleting file");
    await s3Client.send(new DeleteObjectCommand(bucketParams));
    console.log("everything ok");
    
    return formatJSONResponse("CSV parsed.", 200);
  } catch (error) {
    console.log("Error while parsing CSV ===> ", error);
    throw error;
  }
};

export const main = importFileParser;
