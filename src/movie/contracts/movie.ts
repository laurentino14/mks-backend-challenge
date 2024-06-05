import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export abstract class CreateMovieInputContract {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, example: 'Velozes e Furiosos 10' })
    title: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, example: 'Ação' })
    category: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, example: '2024-06-05T03:50:54.962Z' })
    launchedIn: string
}