import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ name: 'access_token' })
  access_token: string;

  @ApiProperty({ name: 'refresh_token' })
  refresh_token: string;
}

export class UserResponseDto {
  @ApiProperty({ name: 'id' })
  id: number;

  @ApiProperty({ name: 'username' })
  username: string;

  @ApiProperty({ name: 'createdAt' })
  createdAt: string;

  @ApiProperty({ name: 'updatedAt' })
  updatedAt: string;
}
