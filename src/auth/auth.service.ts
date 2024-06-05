import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInputContract, SignInInputContract } from './contracts/user';
import { Auth } from './entities/auth';
import { Email } from './entities/email';
import { User, UserFactory } from './entities/user';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository:Repository<User>, private readonly jwtService: JwtService,private readonly config:ConfigService){}

    async signUp(data:CreateUserInputContract):Promise<Auth>{
        const user = UserFactory.create(data)
        
        user.password.hash()

        await this.userRepository.save(user)
        
        user.password.omit()

        const access_token = this.jwtService.sign({id:user.id},{expiresIn:'2h',secret:this.config.get('JWT_ACCESS_TOKEN_SECRET')})
        const refresh_token = this.jwtService.sign({id:user.id},{expiresIn:'7d',secret:this.config.get('JWT_REFRESH_TOKEN_SECRET')})

        return new Auth(user, access_token, refresh_token) 
    }

    async signIn(data:SignInInputContract):Promise<Auth>{
        const user_email = new Email(data.email)
        
        const user = await this.userRepository.findOne({where:{
            email:user_email
        }})

        if(!user){
            throw new Error('Something went wrong, please sign in again')
        }

        user.password.compare(data.password)
       
        user.password.omit()

        const access_token = this.jwtService.sign({id:user.id},{expiresIn:'2h',secret:this.config.get('JWT_ACCESS_TOKEN_SECRET')})
        const refresh_token = this.jwtService.sign({id:user.id},{expiresIn:'7d',secret:this.config.get('JWT_REFRESH_TOKEN_SECRET')})

        return new Auth(user, access_token, refresh_token) 
    }

    async refreshToken(refresh_token:string):Promise<Auth>{
        const decoded = this.jwtService.verify(refresh_token,{secret:this.config.get('JWT_REFRESH_TOKEN_SECRET')})
        const user = await this.userRepository.findOne({where:{
            id:decoded.id
        }})

        if(!user){
            throw new Error('Something went wrong, please sign in again')
        }

        user.password.omit()

        const access_token = this.jwtService.sign({id:user.id},{expiresIn:'2h',secret:this.config.get('JWT_ACCESS_TOKEN_SECRET')})
        const new_refresh_token = this.jwtService.sign({id:user.id},{expiresIn:'7d',secret:this.config.get('JWT_REFRESH_TOKEN_SECRET')})
        return new Auth(user, access_token, new_refresh_token) 
    }
}
