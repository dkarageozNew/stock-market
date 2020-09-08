import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { redisConfig } from './cache.constants';

@Module({
    imports: [
        RedisModule.register(redisConfig)
    ]
})
export class CacheModule {
}
