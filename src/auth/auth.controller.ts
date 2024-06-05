import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Response } from 'express'
import { ErrorMessage } from 'src/contracts/errors'
import { AuthService } from './auth.service'
import { CreateUserInputContract, SignInInputContract } from './contracts/user'
import { Auth } from './entities/auth'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(private readonly service:AuthService) {}
    
    @Post()
    @ApiOperation({
        summary:'Sign In',
        description: 'Sign in an user by your own credentials'
    })
    @ApiBody({
        type:SignInInputContract,
        required:true,
    })
    @ApiResponse({
        status:200,
        type:Auth,
        description:'Success case'
    })
    @ApiResponse({
        status:400,
        type:ErrorMessage,
        description:'Any error case'
    })
    async signIn(@Body() body:SignInInputContract, @Res() res:Response):Promise<Response<Auth>> {
        try{
            const auth = await this.service.signIn(body)
            return res.status(200).json(auth)
        }catch(err:unknown){
            return res.status(400).json({message:'Something went wrong, please try again'})
        }
    }

    @Post('signup')
    @ApiOperation({
        summary:'Sign Up',
        description: 'Sign up an user'
    })
    @ApiBody({
        type:CreateUserInputContract,
        required:true,
    })
    @ApiResponse({
        status:201,
        type:Auth,
        description:'Success case'
    })
    @ApiResponse({
        status:400,
        type:ErrorMessage,
        description:'Any error case'
    })
    async signUp(@Body() body:CreateUserInputContract, @Res() res:Response):Promise<Response<Auth>> {
        try{
            const auth = await this.service.signUp(body)
            return res.status(201).json(auth)
        }catch(err:unknown){
            return res.status(400).json({message:'Something went wrong, please try again'})
        }
    }

    @Get()
    @ApiBearerAuth("REFRESH")
    @ApiOperation({
        summary:'Refresh Token',
        description: 'Refresh auth tokens if the refresh token is valid',
    })
    @ApiResponse({
        status:200,
        type:Auth,
        description:'Success case'
    })
    @ApiResponse({
        status:400,
        type:ErrorMessage,
        description:'Any error case'
    })
    async refreshToken(@Headers('Authorization') token:string, @Res() res:Response):Promise<Response<Auth>> {
        try{
            const splited = token.split(' ')

            if(splited[0] !== 'Bearer'){
                throw new Error('Something went wrong, please try again')
            }

            if(!splited[1]){
                throw new Error('Something went wrong, please try again')
            }
            
            const auth = await this.service.refreshToken(splited[1])
            return res.status(200).json(auth)
        }catch(err:unknown){
            console.log(err)
            return res.status(400).json({message:'Something went wrong, please try again'})
        }
    }
}
