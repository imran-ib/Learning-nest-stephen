import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        const user = { id, email: 'imran@test.com', password: '123456' };
        return Promise.resolve(user);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'random' } as User]);
      },
      // removeUser: () => {},
      // updateUser: () => {},
    };
    fakeAuthService = {
      // createUser: () => {},
      // singin: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('It Finds All user and returns  list ', async () => {
    const users = await controller.findAllUsers('imran@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('imran@test.com');
  });

  it('Finds One User and returns it', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });
  // it('throws an error of user not found', async (done) => {
  //   fakeUserService.findOne = () => null;
  //   try {
  //     await controller.findUser('1');
  //   } catch (error) {
  //     done();
  //   }
  // });
});
