import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: Record<string, any>): Promise<any> {
    const userExists = await this.userService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.userService.create(createUserDto.username, hash);
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(data: AuthDto) {
    const user = await this.userService.findByUsername(data.username);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async getMe(userId: number) {
    return await this.userService.findOne(userId);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access Denied.');

    const rtMatches = await bcrypt.compare(rt, user.refresh_token);

    if (!rtMatches) throw new ForbiddenException('Access Denied.');

    const tokens = await this.getTokens(user.id, user.username);

    const rtHash = await this.hashData(tokens.refreshToken);

    await this.userService.update(user.id, { refresh_token: rtHash });
    return tokens;
  }

  private async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }
}
