import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'otps',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Otp extends Model<Otp> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @Column(DataType.STRING)
  declare otp: string;

  @Column(DataType.DATE)
  declare expires_at: Date;
}