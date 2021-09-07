import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is in user
    const user = await this.userService.find(email);
    if (user.length) throw new BadGatewayException('User Already Exists');
    // hash
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const res = salt + '.' + hash.toString('hex');
    // save
    const NewUser = await this.userService.create(email, res);
    // return
    return NewUser;
  }
  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);

    if (!user) throw new NotFoundException('User Not Found');
    const [salt, hash] = user.password.split('.');
    const HASH = (await scrypt(password, salt, 32)) as Buffer;
    if (hash !== HASH.toString('hex')) {
      throw new BadRequestException('Bad Credentials');
    }
    return user;
  }
}
