import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOne(id);
  }
  find(email: string) {
    return this.repo.find({ email: email });
  }
  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOne(id);
    if (!user) throw new Error(`User Not Found`);
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async remove(id: number) {
    const user = await this.repo.findOne(id);
    if (!user) throw new Error(`User Not Found`);

    this.repo.remove(user);
  }
}
