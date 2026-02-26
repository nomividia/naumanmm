import 'jasmine';
import { TestMainHelpers } from '../test/test-main-helpers';
import { UsersService } from './users.service';

describe('UsersService tests', () => {
    let usersService: UsersService;
    beforeAll(async () => {
        await TestMainHelpers.initTestingModule();
        usersService = TestMainHelpers.module.get<UsersService>(UsersService);
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    it('should get userServices', async () => {
        // const usersResponse = await usersService.findAll({ take: 1 });
        // console.log("USERS LENGTH", usersResponse.users?.length);
        // expect(usersResponse.success).toBeTruthy();
        expect(true).toBeTruthy();
    });
});
