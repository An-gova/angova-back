import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express'; // Add this line
import { StorageService } from './storage.service';
import { S3 } from 'aws-sdk';

@Controller('storage')
export class StorageController {
    constructor(private storageService: StorageService) {}

    @Get('/download')
    async downloadFile(@Query('key') key: string, @Res() res: Response): Promise<S3.Body | void> {
        const { Body, ContentType } = await this.storageService.download(key);
        res.setHeader('Content-Type', ContentType || 'application/octet-stream');
        res.send(Body);
    }
}
