import { ConfigModule } from '@nestjs/config';

import databaseConfig from './config/database-config';

ConfigModule.forRoot({
  load: [databaseConfig],
});

export default databaseConfig();
