import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Post,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { CreateUserInputContract, SignInInputContract } from './contracts/user'
import { Auth } from './entities/auth'

@Controller('auth')
export class AuthController {
    constructor(private readonly service:AuthService) {}
    
    @Post()
    @Header('Cache-Control', 'none')
    async signIn(@Body() body:SignInInputContract,@Res() res:Response):Promise<Response<Auth>> {
        try{
            const auth = await this.service.signIn(body)
            return res.status(200).json(auth)
        }catch(err:unknown){
            return res.status(400).json({message:'Something went wrong, please sign in again'})
        }
    }

    @Post('signup')
    @Header('Cache-Control', 'none')
    async signUp(@Body() body:CreateUserInputContract,@Res() res:Response):Promise<Response<Auth>> {
        try{
            const auth = await this.service.signUp(body)
            return res.status(200).json(auth)
        }catch(err:unknown){
            return res.status(400).json({message:'Something went wrong, please sign in again'})
        }
    }

    @Get()
    @Header('Cache-Control', 'none')
    async refreshToken(@Headers('Authorization') token ,@Res() res:Response):Promise<Response<Auth>> {
        try{
            const splited = token.split(' ')

            if(splited[0] !== 'Bearer'){
                throw new Error('Something went wrong, please sign in again')
            }

            if(!splited[1]){
                throw new Error('Something went wrong, please sign in again')
            }
            
            const auth = await this.service.refreshToken(splited[1])
            return res.status(200).json(auth)
        }catch(err:unknown){
            return res.status(400).json({message:'Something went wrong, please sign in again'})
        }
    }
}
