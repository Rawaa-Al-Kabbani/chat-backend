import { registerAs } from '@nestjs/config';

export const databaseConfig = () => ({
  url: process.env.DATABASE_URL,
});
export const DatabaseConfig = registerAs('database', databaseConfig);

// docker --version
// Docker version 24.0.7, build 24.0.7-0ubuntu4.1

// Installed: ocker-compose-plugin
// sudo apt-get update
// sudo apt-get install docker-compose-plugin

// docker compose version
// Docker Compose version v2.29.2

// To start
// sudo docker compose upP