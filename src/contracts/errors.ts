import { ApiProperty } from '@nestjs/swagger'

export abstract class ErrorMessage {
  @ApiProperty({
    type: String,
    example: `Something went wrong, please try again`,
  })
  message: string
}

export abstract class NotFoundMessage {
  @ApiProperty({
    type: String,
    example: `Not found`,
  })
  message: string
}
