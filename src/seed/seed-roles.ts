import { Role } from '../roles/role.model';

export const seedRoles = async () => {
  await Role.bulkCreate([
  { name: 'user' } as any,
  { name: 'admin' } as any,
]);

  console.log('✅ Seeded roles');
};
