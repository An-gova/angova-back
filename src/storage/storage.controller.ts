import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express'; // Add this line
import { StorageService } from './storage.service';
import { S3 } from 'aws-sdk';

@Controller('storage')
export class StorageController {
    constructor(private storageService: StorageService) {}

    @Get('/download')
    async downloadFile(@Query('key') key: string, @Res() res: Response): Promise<S3.Body | void> {
        const signedURL =  await this.storageService.download(key);
        if (signedURL) {
            res.json({ url: signedURL }); // Send the signed URL as JSON
        } else {
            res.status(404).send('File not found'); 
        }
    }
}
