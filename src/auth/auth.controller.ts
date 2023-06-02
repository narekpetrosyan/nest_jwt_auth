import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetCurrentUserId } from 'src/lib/decorators/get-user-id.decorator';
import { Public } from 'src/lib/decorators/public.decorator';
import { RtGuard } from './guards/rt.guard';
import { GetCurrentUser } from 'src/lib/decorators/get-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { AuthResponseDto, UserResponseDto } from './dto/response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    type: AuthResponseDto,
    description: 'Returns access and refresh tokens',
  })
  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    type: AuthResponseDto,
    description: 'Returns access and refresh tokens',
  })
  @Public()
  @Post('login')
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: 'Logout' })
  @Get('logout')
  logout(@GetCurrentUserId() userId: number) {
    this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    type: AuthResponseDto,
    description: 'Returns refreshed access token and refresh token',
  })
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: number,
  ) {
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiOperation({ summary: 'Get information about user' })
  @ApiResponse({
    type: UserResponseDto,
    description: 'Returns an object containing information about user',
  })
  @ApiBearerAuth('jwt-auth')
  @Get('me')
  async me(@GetCurrentUserId() userId: number) {
    return await this.authService.getMe(userId);
  }
}
