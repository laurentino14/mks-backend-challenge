import { IsEmail, IsNotEmpty } from 'class-validator'

export class Email {
  @IsEmail({}, { message: 'This email is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  private value: string

  constructor(email: string) {
    this.value = email
  }

  getValue(): string {
    return this.value
  }

  updateValue(email: string): void {
    this.value = email
  }
}