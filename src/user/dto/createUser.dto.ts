import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ name: 'username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ name: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
