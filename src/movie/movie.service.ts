import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CreateMovieInputContract, UpdateMovieInputContract } from './contracts/movie';
import { Movie, MovieFactory } from './entities/movie';

@Injectable()
export class MovieService {
    constructor(@InjectRepository(Movie) private readonly movieRepository:Repository<Movie>){}

    async create(data:CreateMovieInputContract):Promise<Movie>{
        const movie = MovieFactory.create(data)

        movie.slug.generate(movie.getTitle())

        await this.movieRepository.save(movie)

        return movie
    }

    async getByID(id:string):Promise<Movie>{
        return await this.movieRepository.findOne({
            where:{
                id
            }
        })
    }

    async getAll():Promise<Movie[]>{
        return await this.movieRepository.find()
    }

    async getByCategory(category:string):Promise<Movie[]>{
        return await this.movieRepository.query('select * from movies where category = $1',[category])
    }

    async update(data:UpdateMovieInputContract):Promise<Movie>{
        const movie = await this.movieRepository.findOne({where:{id:data.id}})
        movie.update(data)
        await this.movieRepository.update(null,movie)
        return movie
    }

    async delete(id:string):Promise<void>{
        await this.movieRepository.delete({id})
    }
}
