import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';
import { Confirmation } from '../../decorators/confirmation.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(3, 30)
  username: string;

  @IsNotEmpty()
  @Length(3, 30)
  password: string;

  @IsNotEmpty()
  @Confirmation('password')
  password_confirmation: string;
}
