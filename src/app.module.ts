import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { User } from './auth/entities/user';
import { Moovie } from './movie/entities/movie';
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
    entities: [User,Moovie],
    synchronize: true,
  }),AuthModule],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
