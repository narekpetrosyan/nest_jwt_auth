import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetCurrentUserId } from 'src/lib/decorators/get-user-id.decorator';
import { Public } from 'src/lib/decorators/public.decorator';
import { RtGuard } from './guards/rt.guard';
import { GetCurrentUser } from 'src/lib/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() createUserDto: Record<string, any>) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @Get('logout')
  logout(@GetCurrentUserId() userId: number) {
    this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: number,
  ) {
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('profile')
  profile(@Req() req) {
    return req.user;
  }
}
