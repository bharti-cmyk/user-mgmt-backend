import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  Default,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'email_verifications',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class EmailVerification extends Model<EmailVerification> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @Column(DataType.STRING)
  declare token: string;

  @Column(DataType.DATE)
  declare expires_at: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_used: boolean;
}
