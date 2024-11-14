import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  const config = yaml.load(
    readFileSync(join(__dirname, '../../config/config.yml'), 'utf8'),
  ) as Record<string, any>;

  return {
    port: process.env.PORT ?? config.port,
    database: process.env.DATABASE_URL ?? config.database.url,
    jwt: {
      expires: process.env.JWT_EXPIRES ?? config.jwt.expires,
      secret: process.env.JWT_SECRET ?? config.jwt.secret,
    },
    socket: {
      port: process.env.SOCKET_PORT ?? config.socket.port,
      origin: process.env.SOCKET_ORIGIN ?? config.socket.origin
    }
  };
};
