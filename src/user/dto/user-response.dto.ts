export class UserResponseDto {
  constructor(id: string, username: string, pastes_url: string) {
    this.id = id;
    this.username = username;
    this.pastes_url = pastes_url;
  }

  id: string;
  username: string;
  pastes_url: string;
}
