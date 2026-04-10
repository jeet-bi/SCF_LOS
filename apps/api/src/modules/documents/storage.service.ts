import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = config.getOrThrow<string>('storage.bucket');

    this.s3 = new S3Client({
      endpoint: config.getOrThrow<string>('storage.endpoint'),
      region: config.getOrThrow<string>('storage.region'),
      credentials: {
        accessKeyId: config.getOrThrow<string>('storage.accessKey'),
        secretAccessKey: config.getOrThrow<string>('storage.secretKey'),
      },
      forcePathStyle: true,
    });
  }

  generateS3Key(leadId: string, documentType: string, fileName: string): string {
    const ext = fileName.split('.').pop();
    return `leads/${leadId}/${documentType}/${uuid()}.${ext}`;
  }

  async getPresignedUploadUrl(
    s3Key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async getPresignedDownloadUrl(s3Key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async uploadBuffer(
    s3Key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3.send(command);
    this.logger.log(`Uploaded to S3: ${s3Key}`);
  }

  async deleteObject(s3Key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
    });

    await this.s3.send(command);
  }

  async getObjectBuffer(s3Key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
    });

    const response = await this.s3.send(command);
    const chunks: Uint8Array[] = [];

    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}
