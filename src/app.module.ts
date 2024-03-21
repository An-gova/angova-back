import { Logger, Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
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
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from "./middlewares/auth.middleware";
import { RolesMiddleware } from './middlewares/roles.middleware';
import {FixturesModule} from "./fixtures/fixtures.modules";
import {JwtExpiredFilter} from "./exceptions/jwt-expired.filter";
import {APP_FILTER} from "@nestjs/core";


@Module({
    imports: [
        PrometheusModule.register(),
        StorageModule,
        UserModule,
        RoleModule,
        AuthModule,
                FixturesModule,
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
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [AppController],
    providers: [AppService, RolesMiddleware, JwtAuthMiddleware,{
        provide: APP_FILTER,
        useClass: JwtExpiredFilter,
    },],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes(
                {  path: '*',
                       method: RequestMethod.ALL});

        consumer
            .apply(RolesMiddleware)
            .forRoutes(
                {path: '*',
                       method: RequestMethod.ALL});
    }
}

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
