import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export async function mongooseFactory(
  config: ConfigService,
): Promise<MongooseModuleOptions> {
  return {
    uri: `mongodb://localhost:27017`,
    dbName: config.get<string>('DB_NAME'),
    user: config.get<string>('DB_USER'),
    pass: config.get<string>('DB_PASS'),
    authSource: config.get<string>('DB_AUTH_SOURCE'),
  };
}
