import { UserResponseDto } from '../dto/user-response.dto';

export function userAssembler(userId: string, username: string, host: string) {
  return new UserResponseDto(userId, username, `${host}/pastes/user/${userId}`);
}
