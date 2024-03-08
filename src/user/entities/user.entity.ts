import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose  from 'mongoose';
import { Document} from "mongoose";
import { Role } from '../../role/entities/role.entity';

export type UserDocument = User & Document;

@Schema({
  timestamps: true
})

export class User {
  @Prop()
  username: string;

  @Prop({unique: [true, 'Duplicate email entered']})
  email: string;

  @Prop()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop()
  refreshToken: string;

}

export const UserModel = SchemaFactory.createForClass(User);
