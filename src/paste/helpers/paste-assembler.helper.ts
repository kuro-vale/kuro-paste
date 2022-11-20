import { PasteResponseDto } from '../dto/paste-response.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { PasteDocument } from '../schemas/paste.schema';

export function pasteAssembler(
  paste: PasteDocument,
  username: string,
  host: string,
): PasteResponseDto {
  const created_by = new UserResponseDto(
    paste.userId,
    username,
    `${host}/users/${paste.userId}/pastes`,
  );
  return new PasteResponseDto(
    paste._id.toString(),
    paste.filename,
    paste.extension,
    paste.body,
    created_by,
    `${host}/pastes/${paste._id}`,
  );
}
