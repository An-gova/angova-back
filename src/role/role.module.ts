import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleModel } from './entities/role.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleModel }]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})

export class RoleModule {}
export { RoleModel };