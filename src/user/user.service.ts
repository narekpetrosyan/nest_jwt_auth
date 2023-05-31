import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // async findByEmail(email: string): Promise<UserEntity> {
  //   return await this.userRepository.findOneBy({ email });
  // }

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ username });
  }

  async create(username: string, password: string) {
    return await this.userRepository.save({ username, password });
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id: id });
  }

  async update(id: number, updateUserDto: Record<string, any>) {
    return await this.userRepository.update(id, updateUserDto);
  }
}
