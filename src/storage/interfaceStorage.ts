export interface AwsStorageConfig{
    aws_secret_access_key: string;
    aws_access_key_id: string;
    aws_region: string;
}

export interface BucketStorage {
    /**
     * retrieve the image from the storage server
     * @param key the key of the file
     * @param bucketName the name of the bucket
     */
    download(key: string, bucketName: string): Promise<any>;
  }

