import { PasteResponseDto } from '../dto/paste-response.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { userHateoas } from '../../user/helpers/user-hateoas.helper';
import { pasteHateoas } from './paste-hateoas.helper';

export function pasteAssembler(paste, username): PasteResponseDto {
  const created_by = new UserResponseDto(
    paste.user,
    username,
    userHateoas(paste.user),
  );
  return new PasteResponseDto(
    paste._id,
    paste.filename,
    paste.extension,
    paste.body,
    created_by,
    pasteHateoas(paste._id),
  );
}
