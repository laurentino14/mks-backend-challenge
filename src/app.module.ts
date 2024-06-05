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
import { MovieModule } from './movie/movie.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    cache:true,
  }),TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseFloat(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'dev',
    password: process.env.DB_PASS || 'dev',
    database: process.env.DB_NAME || 'dev',
    entities: [User,Movie],
    synchronize: true,
  }),CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
  }),AuthModule, MovieModule],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
