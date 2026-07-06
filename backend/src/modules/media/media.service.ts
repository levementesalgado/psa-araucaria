import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MediaService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async upload(buffer: Buffer, mimeType: string): Promise<string> {
    const key = `photos/${uuid()}.jpg`;
    await this.s3.putObject({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }).promise();
    return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
  }
}
