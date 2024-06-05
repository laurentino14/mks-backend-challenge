import { User } from './user'

export class Auth {
  constructor(
    public readonly user: User,
    private readonly access_token: string,
    private readonly refresh_token: string,
  ) {
    this.user = user
    this.access_token = access_token
    this.refresh_token = refresh_token
  }
}

