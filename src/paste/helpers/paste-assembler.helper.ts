import { PasteResponseDto } from '../dto/paste-response.dto';
import { PasteDocument } from '../schemas/paste.schema';
import { userAssembler } from '../../user/helpers/user-assembler.helper';

export function pasteAssembler(
  paste: PasteDocument,
  username: string,
  host: string,
): PasteResponseDto {
  const created_by = userAssembler(paste.userId, username, host);
  return new PasteResponseDto(
    paste._id.toString(),
    paste.filename,
    paste.extension,
    paste.body,
    paste.stars,
    created_by,
    `${host}/pastes/${paste._id}`,
  );
}
