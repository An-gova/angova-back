import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { Model } from 'mongoose';
import {User, UserDocument} from "../user/entities/user.entity";

@Injectable()
export class FixturesService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async generateFixtures(): Promise<void> {
        const users = [
            {
                username: 'Admin',
                email: 'Admin@fixture.com',
                password: '123',
                role: '65040ec528f750d4de3bcdd5' ,
                refreshToken: 'null',
            },
            {
                username: 'Manager',
                email: 'Manager@fixture.com',
                password: '123',
                role:'65040ec528f750d4de3bcdd6' ,
                refreshToken: 'null',
            },
            {
                username: 'User',
                email: 'User@fixture.com',
                password: '123',
                role: '65040ec528f750d4de3bcdd5',
                refreshToken: 'null',
            },
        ];

        await this.userModel.insertMany(users);
        console.log('Trois utilisateurs générés avec succès.');
    }
}
