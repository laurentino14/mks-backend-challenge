import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export abstract class CreateMovieInputContract {
    @IsString()
    @IsNotEmpty({message:'Title is required'})
    @ApiProperty({ type: String, example: 'Velozes e Furiosos 10' })
    title: string
    
    @IsString()
    @IsNotEmpty({message:'Category is required'})
    @ApiProperty({ type: String, example: 'Ação' })
    category: string
    
    @IsString()
    @IsNotEmpty({message:'LaunchedIn is required'})
    @ApiProperty({ type: String, example: '2024-06-05T03:50:54.962Z' })
    launchedIn: string
}

export abstract class UpdateMovieInputContract{

    @IsString()
    @IsNotEmpty({message:'ID is required'})
    @ApiProperty({ type: String, example: 'Velozes e Furiosos 10' })
    id: string

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, example: 'Velozes e Furiosos 10' })
    title?: string
    
    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, example: 'Ação' })
    category?: string
    
    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, example: '2024-06-05T03:50:54.962Z' })
    launchedIn?: string

}