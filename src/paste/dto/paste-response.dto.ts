import { UserResponseDto } from '../../user/dto/user-response.dto';

export class PasteResponseDto {
  constructor(
    id: string,
    filename: string,
    extension: string,
    body: string,
    stars: number,
    created_by: UserResponseDto,
    url: string,
  ) {
    this.id = id;
    this.filename = filename;
    this.extension = extension;
    this.body = body;
    this.stars = stars;
    this.created_by = created_by;
    this.url = url;
  }

  id: string;
  filename: string;
  extension: string;
  body: string;
  stars: number;
  created_by: UserResponseDto;
  url: string;
}
