import { compareSync, hashSync } from 'bcrypt'
import { IsNotEmpty, IsString } from 'class-validator'

export class Password {
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  private value: string

  constructor(password: string) {
    this.value = password
  }

  getValue(): string {
    return this.value
  }

  updateValue(password: string): void {
    this.value = password
  }

  hash() {
    const hashed = hashSync(this.value, 10)
    this.value = hashed
  }

  omit(){
    this.value = ''
  }

  compare(password: string): void {
    const isValid = compareSync(password, this.value)
    if (!isValid) throw new Error("Invalid password")
  }
}