export class AuthUserDto {
  constructor(username, token) {
    this.username = username;
    this.token = token;
  }

  username: string;
  token: string;
}
