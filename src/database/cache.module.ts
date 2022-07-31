import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

const redisConnection = CacheModule.register<RedisClientOptions>({
    store: redisStore,
    url:"redis://redis:6379",
    ttl: 3600*48,
})

@Module({
    imports: [redisConnection],
    exports:[redisConnection]
})
export class RedisCacheModule { }