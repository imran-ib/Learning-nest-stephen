import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => {
          return user.email === email;
        });
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Can Create A new user', async () => {
    const user = await service.signup('imran@test.com', '123456');
    expect(user.password).not.toEqual('123456');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throes error if user already exists', async (done) => {
    await service.signup('imran@test.com', '123456');

    try {
      await service.signup('imran@test.com', '123456');
    } catch (error) {
      done();
    }
  });

  it('Signs User in with unused email', async (done) => {
    try {
      await service.signin('imran@test.com', '123456');
    } catch (error) {
      done();
    }
  });

  it('Throws an error if wrong password provided', async (done) => {
    await service.signup('imran@test.com', '123456');
    try {
      await service.signin('imran@test.com', 'wrongPassword');
    } catch (error) {
      done();
    }
  });
  it('returns a use if correct password is provided', async () => {
    await service.signup('imran@test.com', '1234567');

    const user = await service.signin('imran@test.com', '1234567');
    expect(user).toBeDefined();
  });
});
