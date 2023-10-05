import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { AwsStorage } from './AwsStorage';
import { ConfigModule, ConfigService} from '@nestjs/config'; 
@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: AwsStorage,
      useFactory: (configService: ConfigService) => {
        const config = {
          aws_access_key_id: configService.get<string>('AWS_ACCESS_KEY_ID'),
          aws_secret_access_key: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
          aws_region: configService.get<string>('AWS_REGION'),
        }
        return new AwsStorage(config);
      },
      inject: [ConfigService],
    },
  ]
})
export class StorageModule {}