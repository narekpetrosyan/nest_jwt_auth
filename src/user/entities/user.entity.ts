import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ name: 'refresh_token', nullable: true, select: false })
  refresh_token: string;
}
