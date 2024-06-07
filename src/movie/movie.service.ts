import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieInputContract, UpdateMovieInputContract } from './contracts/movie';
import { Movie, MovieFactory } from './entities/movie';

@Injectable()
export class MovieService {
    constructor(@InjectRepository(Movie) private readonly movieRepository:Repository<Movie>){}

    async create(data:CreateMovieInputContract):Promise<Movie>{
        const movie = MovieFactory.create(data)

        movie.slug.generate(movie.getTitle())

        const db = await this.movieRepository.save(movie)

        if(!db){
            throw new BadRequestException("Error saving to database")
        }

        return movie
    }

    async getByID(id:string):Promise<Movie>{
        const movie = await this.movieRepository.findOne({
            where:{
                id
            }
        })

        if(!movie){
            throw new NotFoundException('Movie not found')
        }
        return movie
    }

    async getAll():Promise<Movie[]>{
        return await this.movieRepository.find()
    }

    async getByCategory(category:string):Promise<Movie[]>{
           const query = await this.movieRepository.query(`select * from movies where category = $1::text`,[category])
           
        return [...query.map((movie:{
            id:string,
            title:string,
            slug:string,
            category:string,
            launchedIn:string,
            createdAt:string,
            updatedAt:string
        })=>MovieFactory.restore(movie))]
    }

    async update(data:UpdateMovieInputContract):Promise<Movie>{
        const movie = await this.movieRepository.findOne({where:{id:data.id}})
        movie.update(data)
        
        const db = await this.movieRepository.update({id:data.id},movie)

        if(!db){
            throw new BadRequestException('Error when updating in database')
        }
        
        return movie
    }

    async delete(id:string):Promise<void>{
        const db = await this.movieRepository.delete({id})
        if(!db.affected){
            throw new BadRequestException('Error when deleting in database')
        }
    }
}
