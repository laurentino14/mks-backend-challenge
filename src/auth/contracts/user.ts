import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export abstract class CreateUserInputContract {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @IsEmail({}, { message: 'This email is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string
}

export abstract class UpdateUserInputContract {
    @IsString()
    @IsOptional()
    name?: string
    
    @IsEmail({}, { message: 'This email is invalid' })
    @IsOptional()
    email?: string
    
    @IsString()
    @IsOptional()
    password?: string
}

export abstract class SignInInputContract{
  @IsEmail({}, { message: 'This email is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string
}
