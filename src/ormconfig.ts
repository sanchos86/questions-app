import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

import databaseConfig from './config/database-config';

ConfigModule.forRoot({
  load: [databaseConfig],
});

export default new DataSource(databaseConfig());
