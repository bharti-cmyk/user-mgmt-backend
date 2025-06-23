import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Op } from 'sequelize';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/userResponse.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async findPaginatedUsers(page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc', search?: string): Promise<{ data: UserResponseDto[]; total: number; page: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    const where = search
      ? {
        username: { [Op.like]: `%${search}%` },
      }
      : {};

    const { count, rows } = await this.userModel.findAndCountAll({
      where,
      offset,
      limit,
      order: [[sortBy, sortOrder]],
      raw: true
    });

    const rowsData = plainToInstance(UserResponseDto, rows, {
      enableImplicitConversion: true,
    });

    return {
      data: rowsData,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async update(id: number, data: Partial<User>): Promise<UserResponseDto | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;

    const updatedUser = await user.update(data);

    return plainToInstance(UserResponseDto, updatedUser, {
      enableImplicitConversion: true,
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.userModel.destroy({ where: { id } });
    return deleted > 0;
  }
}