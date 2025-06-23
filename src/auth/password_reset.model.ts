import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'password_resets',
  timestamps: true,
  underscored: true,
})
export class PasswordReset extends Model<PasswordReset> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @Column(DataType.STRING)
  declare token: string;

  @Column(DataType.DATE)
  declare expires_at: Date;
}