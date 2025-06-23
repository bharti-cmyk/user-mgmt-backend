import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async findPaginatedUsers(page: number, limit: number, search?: string) {
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
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }


  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.userModel.destroy({ where: { id } });
    return deleted > 0;
  }
}