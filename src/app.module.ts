import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { redisStore } from 'cache-manager-redis-store'
import type { RedisClientOptions } from 'redis'
import { AuthModule } from './auth/auth.module'
import { AuthService } from './auth/auth.service'
import { User } from './auth/entities/user'
import { Movie } from './movie/entities/movie'
import { MovieModule } from './movie/movie.module'
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    cache:true,
  }),TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'ep-divine-truth-a5ulro3s.us-east-2.aws.neon.tech',
    username: 'mks-backend-challenge_owner',
    password: 'wtRDJ2IBum0c',
    database: 'mks-backend-challenge',
    ssl: true ,
    entities: [User,Movie],
    synchronize: true,
  }),CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: 'popular-katydid-33936.upstash.io',
      username: 'default',
      port: 6379,
      password: 'AYSQAAIncDFiMDY4OWVhNTc2YmI0ZGVjYmIwM2M5NTFiMjg2ZTQ0MHAxMzM5MzY',
      isGlobal: true,
  }),AuthModule, MovieModule],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
