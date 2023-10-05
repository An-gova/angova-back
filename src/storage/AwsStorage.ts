import * as AWS from 'aws-sdk';
import { AwsStorageConfig, BucketStorage } from './interfaceStorage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsStorage implements BucketStorage {
    private readonly s3: AWS.S3;

    public constructor(config:AwsStorageConfig) {
        AWS.config.update({
            accessKeyId: config.aws_access_key_id,
            secretAccessKey: config.aws_secret_access_key,
            region: config.aws_region,
        });
        this.s3 = new AWS.S3();
    }

    async download(key: string, bucketName:string): Promise<AWS.S3.GetObjectOutput> {
        try {
            const params = {
                Bucket: bucketName,
                Key: key,
            };

            return await this.s3.getObject(params).promise();

        } catch (error) {
            throw error;
        }
    }
}