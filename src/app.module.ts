import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel } from './user/entities/user.entity';
import { RoleModel } from './role/entities/role.entity';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { StorageModule } from './storage/storage.module';


@Module({
  imports: [
    PrometheusModule.register(),
    StorageModule,
    UserModule,
    RoleModule,
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(getDbConnectionString(), {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
                    console.log('is connected');
          syncDatabase(connection).then(r => console.log("coucou"));
        });
        connection.on('disconnected', () => {
          console.log('DB disconnected');
        });
        connection.on('error', (error) => {
          console.log('DB connection failed! for error: ', error);
        });
        return connection;
      },
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
function getDbConnectionString() {
  const dbConnectionString = process.env.DB_URI;
  const logger = new Logger('AppModule');
  logger.log(`DB Connection string: ${dbConnectionString}`);
  return dbConnectionString;
}

async function syncDatabase(connection) {
  const userModel = connection.model('UserModel');
  await userModel.syncIndexes();
  const roleModel = connection.model('RoleModel');
  await roleModel.syncIndexes();
}
