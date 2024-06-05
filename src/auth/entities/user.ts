import { IsNotEmpty } from 'class-validator'
import { randomUUID } from 'crypto'
import { Email } from './email'
import { Password } from './password'

export class User {
  @IsNotEmpty({ message: 'Name is required' })
  public readonly id: string
  @IsNotEmpty({ message: 'Name is required' })
  private name: string
  @IsNotEmpty({ message: 'Email is required' })
  private readonly email: Email
  @IsNotEmpty({ message: 'Password is required' })
  private readonly password: Password
  public readonly createdAt: string
  private updatedAt: string|null
  private deletedAt: string|null



  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt?: string|null,
    deletedAt?: string|null
  ) {
    this.id = id
    this.name = name
    this.email = new Email(email)
    this.password = new Password(password)
    this.createdAt = createdAt || new Date().toISOString()    
    this.updatedAt = updatedAt || null
    this.deletedAt = deletedAt || null
    
  }

  getId(): string {
    return this.id
  }

  updateUser(data:{name?:string, email?:string, password?:string}){
    if(data.name) {
      this.name = data.name
    }
    if(data.email) {
      this.email.updateValue(data.email)
    }
    if(data.password) {
      this.password.updateValue(data.password)
    }
  }
}


export class UserFactory{

  static create(data: {name:string, email:string, password:string}):User{
    return new User(randomUUID(), data.name, data.email, data.password, new Date().toISOString())
  }

  static restore(data: {id:string, name:string, email:string, password:string,updatedAt:string|null,deletedAt:string|null}):User{
    const user = new User(data.id,data.name,data.email,data.password,new Date().toISOString(),data.updatedAt,data.deletedAt)
    return user
  }
}