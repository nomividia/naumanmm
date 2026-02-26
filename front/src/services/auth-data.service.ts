import { MainHelpers } from 'nextalys-js-helpers';
import { Subject } from 'rxjs';
import { AppPage } from '../../../shared/shared-constants';
import { UserDto } from '../providers/api-client.generated';
import { CommonDataService } from './common-data.service';
import { GlobalAppService } from './global.service';

interface PageWithData {
    page: AppPage;
    data?: string;
}

export interface AppUserConnection {
    connection: string;
    page: PageWithData;
}

export interface ConnectedUserWithPages {
    userId: string;
    connections: AppUserConnection[];
}

export class AuthDataService {
    private static pCurrentUser: UserDto;
    public static currentAuthToken: string;
    public static currentUserChanged = new Subject<void>();
    public static currentRequester: UserDto;
    private static pConnectedUsersList: ConnectedUserWithPages[] = [];
    public static UsersList: UserDto[] = [];
    public static usersListLoaded = false;

    public static set currentUser(user: UserDto) {
        this.pCurrentUser = user;
        this.currentUserChanged.next();
    }

    public static get currentUser(): UserDto {
        return this.pCurrentUser;
    }

    public static set ConnectedUsersList(val: ConnectedUserWithPages[]) {
        this.pConnectedUsersList = val;
        this.MapConnectedUsers();
    }

    public static get ConnectedUsersList() {
        return this.pConnectedUsersList;
    }

    public static get ConnectedUsersListCount() {
        return this.pConnectedUsersList.filter((x) => x.connections.length > 0)
            .length;
    }

    public static ConnectedUsersListWithUserData: {
        user: UserDto;
        pages: string[];
    }[];

    public static MapConnectedUsers() {
        if (
            !this.pConnectedUsersList ||
            !this.UsersList ||
            this.UsersList.length === 0
        ) {
            return;
        }

        const array: { user: UserDto; pages: string[] }[] = [];

        for (const userConnection of this.pConnectedUsersList) {
            if (userConnection.connections.length > 0) {
                const userDto = this.UsersList.find(
                    (x) => x.id === userConnection.userId,
                );

                if (userDto) {
                    let userPages: PageWithData[] =
                        userConnection.connections.map((x) => x.page);
                    userPages = userPages.filter((x) => x && !!x.page);
                    array.push({
                        user: userDto,
                        pages: userPages.map(
                            (x) => x.page + (!!x.data ? ' - ' + x.data : ''),
                        ),
                    });
                }
            }
        }

        this.ConnectedUsersListWithUserData = array;
    }

    public static otherUsersCountOnPage(page?: AppPage) {
        return this.getOtherUserIdsOnPage(page).length;
    }

    /**
     * Return true if another user is on same page
     */
    public static otherUserOnPage(page?: AppPage) {
        return this.getOtherUserIdsOnPage(page).length > 0;
    }

    public static getOtherUserIdsOnPage(page?: AppPage) {
        if (!this.currentUser) {
            return [];
        }

        if (!page) {
            page = GlobalAppService.currentPage;
        }

        if (!page) {
            return [];
        }

        const userIds: string[] = [];
        for (const userConnection of this.pConnectedUsersList) {
            if (
                userConnection.userId !== this.currentUser.id &&
                userConnection.connections.some(
                    (x) =>
                        x.page &&
                        x.page.page &&
                        x.page.page.toString() === page.toString(),
                )
            ) {
                userIds.push(userConnection.userId);
            }
        }

        return userIds;
    }

    public static getOtherUserOnPage(page?: AppPage) {
        const otherUserIds = this.getOtherUserIdsOnPage(page);

        if (otherUserIds.length === 0) {
            return null;
        }

        if (!this.UsersList) {
            return null;
        }

        return this.UsersList.find((x) => x.id === otherUserIds[0]);
    }

    public static async waitForUsersListLoaded() {
        await MainHelpers.waitForBoolValue(() => this.usersListLoaded, 50, 200);
    }

    static async waitForAuthServiceInitialized() {
        await MainHelpers.waitForBoolValue(
            () => CommonDataService.authProviderInitialized,
            50,
            200,
        );
    }
}
