import { CACHE_MANAGER } from '@nestjs/cache-manager'
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
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

    constructor(private readonly service:MovieService, @Inject(CACHE_MANAGER) private redis: Cache,){}

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
            const movie = await this.service.getByID(id)

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
            const movies = await this.service.getAll()

            return res.status(200).json([movies.map(mv => mv.toJSON())])
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
            console.log(err)
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
