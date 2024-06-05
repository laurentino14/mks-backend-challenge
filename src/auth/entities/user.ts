import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { randomUUID } from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Email } from './email'
import { Password } from './password'

@Entity({name:'users'})
export class User {
  @PrimaryColumn({ primary:true, type: 'text', name:'id'})
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  public readonly id: string

  @Column({ type: 'varchar',length:255, nullable: false, name:'name'})
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  private name: string

  @Column({ type: 'varchar',length:255, nullable: false, unique:true, name:'email'})
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  public readonly email: Email

  @Column({ type: 'varchar',length:255, nullable: false, name:'password'})
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  public readonly password: Password

  @Column({ type: 'varchar',length:50, nullable:false, name:'created_at'})
  @IsString()
  @IsNotEmpty({ message: 'Created At is required' })
  public readonly createdAt: string


  @Column({ type: 'varchar',length:50, nullable:true, name:'updated_at'})
  @IsString()
  @IsOptional()
  private updatedAt: string|null
  
  @IsString()
  @IsOptional()
  @Column({ type: 'varchar',length:50, nullable:true, name:'deleted_at'})
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

  getName(): string {
    return this.name
  }

  getUpdatedAt(): string|null {
    return this.updatedAt
  }

  getDeletedAt(): string|null {
    return this.deletedAt
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