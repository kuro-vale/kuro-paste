import { User } from '../../user/schemas/user.schema';

export class CreatePasteDto {
  filename: string;
  extension: string;
  body: string;
  user: User;
}
