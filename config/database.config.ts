import { registerAs } from '@nestjs/config';

export const databaseConfig = () => ({
  url: process.env.DATABASE_URL,
});
export const DatabaseConfig = registerAs('database', databaseConfig);