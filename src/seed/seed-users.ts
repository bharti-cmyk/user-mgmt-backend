import { User, UserCreationAttributes } from '../users/user.model';
import * as bcrypt from 'bcrypt';

export const seedUsers = async () => {
  const password = await bcrypt.hash('password123', 10);

  const users: UserCreationAttributes[] = [
    {
      username: 'admin_user',
      email: 'admin@example.com',
      password,
      avatar_url: '',
      bio: 'Admin account',
      is_verified: true,
      role: 'admin',
    },
    {
      username: 'john_doe',
      email: 'john@example.com',
      password,
      avatar_url: '',
      bio: 'Regular user account',
      is_verified: true,
      role: 'user',
    },
  ];

  await User.bulkCreate(users);
  console.log('✅ Seeded users');
};