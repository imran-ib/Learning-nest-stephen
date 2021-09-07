import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  email: string;
  @IsOptional()
  @IsString()
  password: string;
}
