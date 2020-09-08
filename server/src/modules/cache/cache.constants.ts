import { RedisModuleOptions } from 'nestjs-redis';

import { environment } from '../../environment';

export const redisConfig: RedisModuleOptions = {
    url: environment.REDIS_URL
};
