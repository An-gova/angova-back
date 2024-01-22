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

    async download(key: string, bucketName:string): Promise<any> {
        try {
            const params = {
                Bucket: bucketName,
                Key: key,
                Expires: 604800,
            };
            return await this.s3.getSignedUrl('getObject',params);

        } catch (error) {
            throw error;
        }
    }
}