import { Sequelize } from 'sequelize-typescript';
import { seedUsers } from './seed-users';
// import { seedFollows } from './follow.seed';
// import { seedPosts } from './post.seed';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

const runSeeders = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sequelize = app.get(Sequelize);

  await sequelize.sync({ force: false });

  await seedUsers();

  console.log('✅ All seeders completed successfully');

  process.exit(0);
};

runSeeders();