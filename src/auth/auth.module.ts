import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user';

@Module({
  imports:[TypeOrmModule.forFeature([User]),JwtModule.register({
    global: true,
  })],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[TypeOrmModule]
})
export class AuthModule {}
