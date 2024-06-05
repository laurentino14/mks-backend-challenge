import { ApiProperty, OmitType } from '@nestjs/swagger'
import { User } from './user'

export class Auth {
  @ApiProperty({
    type: OmitType(User,['password']),
  })
  public readonly user: Omit<User, 'password'>
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTJlMzU3M2MtNzY0Mi00MGYzLWJhNjEtZWM4ZGZjM2NjNGE3IiwiaWF0IjoxNzE3MTk1MjMzLCJleHAiOjE3MTcyODE2MzN9.Z2CEGPnZj7_pB9oC9MGvQFG0l6jlb0rnKWlKSRD41eU',
  })
  private readonly access_token: string
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTJlMzU3M2MtNzY0Mi00MGYzLWJhNjEtZWM4ZGZjM2NjNGE3IiwiaWF0IjoxNzE3MTk1MjMzLCJleHAiOjE3MTcyODE2MzN9.Z2CEGPnZj7_pB9oC9MGvQFG0l6jlb0rnKWlKSRD41eU',
  })
  private readonly refresh_token: string
  constructor(user: User, access_token: string, refresh_token: string) {
    this.user = user
    this.access_token = access_token
    this.refresh_token = refresh_token
  }
}

