import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CreateMovieInputContract } from './contracts/movie';
import { Movie } from './entities/movie';

@Injectable()
export class MovieService {
    constructor(@InjectRepository(Movie) private readonly movieRepository:Repository<Movie>){}

    async create(data:CreateMovieInputContract):Movie{


    }
}
