
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel} from '../user/entities/user.entity';
import { FixturesService } from './fixtures.service';
import {FixturesController} from "./fixtures.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
    ],
    controllers: [FixturesController],
    providers: [FixturesService],
    exports: [FixturesService],
})
export class FixturesModule {}
