import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  Default,
} from 'sequelize-typescript';

export interface UserCreationAttributes {
  username: string;
  email: string;
  password: string;
  avatar_url: string;
  bio: string;
  is_verified?: boolean;
  role?: 'admin' | 'user';
  reset_token?: string | null;
}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare username: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.TEXT)
  declare avatar_url: string;

  @Column(DataType.TEXT)
  declare bio: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_verified: boolean;

  @Default('user')
  @Column(DataType.ENUM('admin', 'user'))
  declare role: 'admin' | 'user';

  @Column(DataType.STRING)
  declare reset_token: string | null;
}