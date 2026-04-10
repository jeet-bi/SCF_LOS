import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@los-scf/types';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected. Seeding...');

  const userRepo = AppDataSource.getRepository(User);

  const users = [
    {
      name: 'Admin User',
      email: 'admin@los-scf.com',
      password: 'Admin@1234',
      role: UserRole.ADMIN,
      mobile: '9000000001',
    },
    {
      name: 'Credit Manager',
      email: 'cm@los-scf.com',
      password: 'Admin@1234',
      role: UserRole.CREDIT_MANAGER,
      mobile: '9000000002',
    },
    {
      name: 'Underwriter One',
      email: 'uw@los-scf.com',
      password: 'Admin@1234',
      role: UserRole.UNDERWRITER,
      mobile: '9000000003',
    },
    {
      name: 'Ops Agent',
      email: 'ops@los-scf.com',
      password: 'Admin@1234',
      role: UserRole.OPS_AGENT,
      mobile: '9000000004',
    },
  ];

  for (const userData of users) {
    const existing = await userRepo.findOne({ where: { email: userData.email } });
    if (existing) {
      console.log(`  Skipping existing user: ${userData.email}`);
      continue;
    }

    const passwordHash = await bcrypt.hash(userData.password, 12);
    const user = userRepo.create({
      name: userData.name,
      email: userData.email,
      passwordHash,
      role: userData.role,
      mobile: userData.mobile,
      isActive: true,
    });

    await userRepo.save(user);
    console.log(`  Created user: ${userData.email} (${userData.role})`);
  }

  console.log('\nSeed complete!');
  console.log('Default credentials:');
  users.forEach((u) => console.log(`  ${u.email} / ${u.password} [${u.role}]`));

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
