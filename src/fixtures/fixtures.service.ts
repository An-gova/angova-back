import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { Model } from 'mongoose';
import {User, UserDocument} from "../user/entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class FixturesService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}


    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }
    async generateFixtures(): Promise<void> {
        const passwordHash = await this.hashData("123")
        const users = [
            {
                username: 'Admin',
                email: 'Admin@fixture.com',
                password: passwordHash,
                role: '65040ec528f750d4de3bcdd5' ,
                refreshToken: 'null',
            },
            {
                username: 'Manager',
                email: 'Manager@fixture.com',
                password: passwordHash,
                role:'65040ec528f750d4de3bcdd6' ,
                refreshToken: 'null',
            },
            {
                username: 'User',
                email: 'User@fixture.com',
                password: passwordHash,
                role: '65040ec528f750d4de3bcdd7',
                refreshToken: 'null',
            },
        ];

        await this.userModel.insertMany(users);
        console.log('Trois utilisateurs générés avec succès.');
    }
}
