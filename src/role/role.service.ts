import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './entities/role.entity'; // Importez RoleDocument
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
      @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findOne(id: string): Promise<RoleDocument> { // Utilisez RoleDocument ici
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleDocument> { // Utilisez RoleDocument ici
    const updatedRole = await this.roleModel.findByIdAndUpdate(
        id,
        updateRoleDto,
        { new: true },
    );
    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return updatedRole;
  }

  async remove(id: string): Promise<RoleDocument> { // Utilisez RoleDocument ici
    const removedRole = await this.roleModel.findByIdAndRemove(id);
    if (!removedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return removedRole;
  }
}
