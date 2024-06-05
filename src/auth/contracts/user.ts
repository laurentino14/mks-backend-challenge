import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export abstract class CreateUserInputContract {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({type:String, required:true, example:'John Doe'})
  name: string

  @IsEmail({}, { message: 'This email is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({type:String, required:true, example:'johndoe@example.com'})
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({type:String, required:true, example:'johnDOE@123'})
  password: string
}

export abstract class UpdateUserInputContract {
    @IsString()
    @IsOptional()
    @ApiProperty({type:String, required:false, example:'John Doe'})
    name?: string
    
    @IsEmail({}, { message: 'This email is invalid' })
    @IsOptional()
    @ApiProperty({type:String, required:false, example:'johndoe@example.com'})
    email?: string
    
    @IsString()
    @IsOptional()
    @ApiProperty({type:String, required:false, example:'johnDOE@123'})
    password?: string
}


export abstract class SignInInputContract{
  @IsEmail({}, { message: 'This email is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({type: String,required:true,example:'johndoe@example.com'})
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({type:String,required:true,example:"johnDOE@123"})
  password: string
}
