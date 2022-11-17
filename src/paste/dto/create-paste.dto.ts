import { IsAscii, IsNotEmpty, Length } from 'class-validator';

export class CreatePasteDto {
  @IsNotEmpty()
  @IsAscii()
  @Length(1, 35)
  filename: string;

  @IsNotEmpty()
  @IsAscii()
  @Length(2, 10)
  extension: string;

  @IsNotEmpty()
  body: string;
}
