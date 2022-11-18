import { PasteResponseDto } from '../dto/paste-response.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { userHateoas } from '../../user/helpers/user-hateoas.helper';
import { pasteHateoas } from './paste-hateoas.helper';
import { PasteDocument } from '../schemas/paste.schema';

export function pasteAssembler(
  paste: PasteDocument,
  username: string,
): PasteResponseDto {
  const created_by = new UserResponseDto(
    paste.userId,
    username,
    userHateoas(paste.userId),
  );
  return new PasteResponseDto(
    paste._id.toString(),
    paste.filename,
    paste.extension,
    paste.body,
    created_by,
    pasteHateoas(paste._id.toString()),
  );
}
