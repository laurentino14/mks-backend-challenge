import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ErrorMessage, NotFoundMessage } from 'src/contracts/errors';
import { CreateMovieInputContract, UpdateMovieInputContract } from './contracts/movie';
import { Movie } from './entities/movie';
import { MovieService } from './movie.service';

@Controller('movie')
@UseGuards(AuthGuard)
@ApiBearerAuth("ACCESS")
@ApiTags('Movie')
export class MovieController {

    constructor(private readonly service:MovieService, @Inject(CACHE_MANAGER) private redis: CacheStore,private readonly config:ConfigService){}

    @Post()
    @ApiOperation({
        summary:'Add movie',
        description: 'Add a movie',
    })
    @ApiResponse({
        status:201,
        type:Movie,
        description:'Success case'
    })
    @ApiResponse({
        status:400,
        type:ErrorMessage,
        description:'Any error case'
    })
    async create(@Body() body:CreateMovieInputContract, @Res() res:Response):Promise<Response<Movie>>{
        try{
            const movie = await this.service.create(body)
            return res.status(201).json(movie.toJSON())

        }catch(err:unknown){
            return res.status(400).json({message:"Something went wrong, please try again"})
        }
    }

    @Get(':id')
    @ApiOperation({
        summary:'Get by ID',
        description: 'Get a movie by :id param',
    })
    @ApiResponse({
        status:200,
        type:Movie,
        description:'Success case'
    })
    @ApiResponse({
        status:404,
        type:NotFoundMessage,
        description:'When the movie cannot be found'
    })
    @ApiResponse({
        status:400,
        type:ErrorMessage,
        description:'Another error case'
    })
    async getByID(@Param('id') id:string,@Res() res:Response):Promise<Response<Movie>>{
        try{
            const cached = await this.redis.get(`get-movie-${id}`)
            if(cached){
                console.log(`get-movie-${id} - hit on cache`)
                return res.status(200).json(cached) 
            }
            const movie = await this.service.getByID(id)
            await this.redis.set(`get-movie-${id}`,movie.toJSON(),{ttl:this.config.get('NODE_ENV') === 'production'? 60*5 : 10})
            console.log(`get-movie-${id} - hit without cache`)
            return res.status(200).json(movie.toJSON())

        }catch(err:any){
            if(err.message = 'Movie not found'){
                return res.status(404).json({message:'Movie not found'})
            }

            return res.status(400).json({message:"Something went wrong, please try again"})

        }
    }

    @Get()
    @ApiOperation({
        summary:'Get all',
        description: 'Get all movies available',
    })
    @ApiResponse({
        status:200,
        type:Movie,
        description:'Success case'
    })
    @ApiResponse({
        status:400,
        type:ErrorMessage,
        description:'Any error case'
    })
    async getAll(@Res() res:Response):Promise<Response<Movie[]>>{
        try{
            const cached = await this.redis.get(`get-all-movies`)
            if(cached){
                console.log(`get-all-movies - hit on cache`)
                return res.status(200).json(cached) 
            }
            const movies = await this.service.getAll()
            const finalMovies = [...movies.map(mv => mv.toJSON())]
            // @ts-ignore
            await this.redis.set(`get-all-movies`,finalMovies,{ttl:this.config.get('NODE_ENV') === 'production'?60*5 : 10})
            console.log('get-all-movies - hit without cache')
            return res.status(200).json(finalMovies)
        }catch(err:unknown){
            return res.status(400).json({message:"Something went wrong, please try again"})
        }
    }

    @Patch()
    @ApiOperation({
        summary:'Update movie',
        description: 'Update title, category or launched date',
    })
    @ApiResponse({
        status:200,
        type:Movie,
        description:'Success case'
    })
    @ApiResponse({
        status:400,
        type:ErrorMessage,
        description:'Any error case'
    })
    async update(@Body() body:UpdateMovieInputContract, @Res() res:Response):Promise<Response<Movie>>{
        try{
            const movie = await this.service.update(body)
            return res.status(200).json(movie.toJSON())
        }catch(err:unknown){
            return res.status(400).json({message:"Something went wrong, please try again"})
        }
    }
    
    @Delete(':id')
    @ApiOperation({
        summary:'Delete movie',
        description: 'Delete a movie by :id param',
    })
    @ApiResponse({
        status:200,
        type:Movie,
        description:'Success case'
    })
    @ApiResponse({
        status:400,
        type:ErrorMessage,
        description:'Any error case'
    })
    async delete(@Param('id') id:string, @Res() res:Response):Promise<Response<string>>{
        try{
            await this.service.delete(id)
            return res.status(200).json("Successfully deleted movie")
        }catch(err:unknown){
            return res.status(400).json({message:"Something went wrong, please try again"})
        }
    }

}
