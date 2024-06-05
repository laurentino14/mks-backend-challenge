import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { randomUUID } from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Slug } from './slug'

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryColumn({ primary: true, type: 'text', name: 'id' })
  @IsString()
  @IsNotEmpty({message:'ID is required'})
  @ApiProperty({type:String, example:'3e5faedc-4365-4e00-a620-8a3929043ad2'})
  public readonly id: string
  
  @Column({type:'varchar',length:255, name:'title', nullable:false })
  @IsString()
  @IsNotEmpty({message: 'Title is required'})
  @ApiProperty({type:String, example:'Velozes e Furiosos 10'})
  private title: string
  
  @Column({type:'text', name:'slug', nullable:false, unique:true, transformer:{
    from(value:string){
      return new Slug(value)
    },
    to(slug:Slug) {
      return slug.getValue()
    },
  }})
  @IsString()
  @IsNotEmpty({message: 'Slug is required'})
  @ApiProperty({type:String, example:'velozes-e-furiosos-10-3e5faedc'})
  public readonly slug: Slug
  
  @Column({type:'varchar', length:50, name:'category', nullable:false})
  @IsString()
  @IsNotEmpty({message:'Category is required'})
  @ApiProperty({type:String, example:'Ação'})
  private category: string
  
  @Column({type:'varchar', length:50, name:'launched_in', nullable:false})
  @IsString()
  @IsNotEmpty({message: 'LanchedIn is required'})
  @ApiProperty({type:String, example:'2024-06-05T03:50:54.962Z'})
  private launchedIn: string
  
  @Column({type: 'varchar',length:50,name:'created_at',nullable:false})
  @IsString()
  @IsNotEmpty({message:'CreatedAt is required'})
  @ApiProperty({type:String, example:'2024-06-05T03:50:54.962Z'})
  public readonly createdAt: string
  
  @Column({type:'varchar',length:50,name:'updated_at',nullable:true})
  @IsString()
  @IsOptional()
  @ApiProperty({type:String, default:null, examples:['2024-06-05T03:50:54.962Z',null]})
  private updatedAt: string | null
  constructor(
    id: string,
    title: string,
    category: string,
    launchedIn: string,
    createdAt: string,
    updatedAt?: string | null,
    slug?: string,
  ) {
    this.id = id
    this.title = title
    this.category = category
    this.launchedIn = launchedIn
    this.createdAt = createdAt
    this.updatedAt = updatedAt || null
    if (!slug) {
      this.slug = new Slug()
      this.slug.generate(title)
    }else{
      this.slug = new Slug(slug)
    }
  }

  getTitle(): string {
    return this.title
  }

  getCategory(): string {
    return this.category
  }

  getLaunchedIn(): string {
    return this.launchedIn
  }

  getUpdatedAt(): string {
    return this.updatedAt
  }

  update(data: {
    title?: string
    category?: string
    launchedIn?: string
  }): void {
    if (data.title) {
      this.title = data.title
      this.slug.generate(data.title)
    }
    if (data.category) {
      this.category = data.category
    }
    if (data.launchedIn) {
      this.launchedIn = data.launchedIn
    }
    this.updatedAt = new Date().toISOString()
  }

  toJSON(){
    return {
      id: this.id,
      title: this.title,
      slug: this.slug.getValue(),
      category: this.category,
      launchedIn: this.launchedIn,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt ,
    }
  }
}

export class MovieFactory{
  static create(data:{
    title:string,
    category:string,
    launchedIn:string,
  }):Movie{
    return new Movie(randomUUID(),data.title,data.category,data.launchedIn,new Date().toISOString())
  }

  static restore(data:{id:string,title:string,category:string,launchedIn:string,createdAt:string,updatedAt:string,slug:string}):Movie{
    return new Movie(data.id,data.title,data.category,data.launchedIn,data.createdAt,data.updatedAt,data.slug)
  }
}