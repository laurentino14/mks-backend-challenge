import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Movie } from './entities/movie';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports:[TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule {}
