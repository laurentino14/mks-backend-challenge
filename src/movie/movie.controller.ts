import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Body, Controller, Inject, Res } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import { CreateMovieInputContract } from './contracts/movie';
import { Movie } from './entities/movie';
import { MovieService } from './movie.service';

@Controller('movie')
@ApiBearerAuth()
export class MovieController {

    constructor(private readonly service:MovieService, @Inject(CACHE_MANAGER) private redis: Cache){}

    async create(@Body() body:CreateMovieInputContract, @Res() res:Response):Promise<Response<Movie>>{
        try{
            const movie = await this.service.create(body)
            return res.status(201).json(movie)

        }catch(err:unknown){
            return res.status(400).json("Something went wrong, please try again")
        }
    }

}
