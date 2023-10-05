import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsStorage } from './AwsStorage';

@Injectable()
export class StorageService {
    constructor(
        private readonly awsStorage: AwsStorage
    ) {}
    
    async download(key: string): Promise<AWS.S3.GetObjectOutput> {

        const bucketName = "assets-angova";
        
        try { 
            return await this.awsStorage.download(key, bucketName);
        } catch (error) {
            throw new HttpException(`Failed to download image, ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
