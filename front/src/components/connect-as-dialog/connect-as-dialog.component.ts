import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDto, UsersService } from '../../providers/api-client.generated';
import { AuthProvider } from '../../providers/auth-provider';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-connect-as-dialog',
    templateUrl: './connect-as-dialog.component.html',
    styles: [''],
    encapsulation: ViewEncapsulation.None,
})
export class ConnectAsDialog extends BaseComponent {
    public users: UserDto[];
    public selectedUser: UserDto;
    public errorMessage: string;

    constructor(
        public dialogRef: MatDialogRef<ConnectAsDialog>,
        private authProvider: AuthProvider,
        private authService: UsersService,
    ) {
        super();
    }

    public async connectAs() {
        if (!this.selectedUser) {
            this.errorMessage = 'Veuillez sélectionner un utilisateur.';

            return;
        }

        if (this.selectedUser.id === this.AuthDataService.currentUser.id) {
            this.errorMessage = 'Vous êtes déjà connecté avec ce compte.';

            return;
        }

        const response = await this.authProvider.logAs(this.selectedUser.id);

        if (response.success) {
            this.GlobalAppService.ShowMainLoadingOverlay();

            if (
                this.GlobalAppService.userHasOneOfRoles(
                    this.AuthDataService.currentUser,
                    [this.RolesList.Candidate],
                )
            ) {
                window.location.href =
                    window.location.origin +
                    '/' +
                    this.RoutesList.Candidate_MyDashBoard;

                return;
            }

            window.location = window.location;
        }
    }

    async loadUsersFunction(input: string) {
        const response = await this.authService
            .getAllUsers({ start: 0, length: 100, search: input })
            .toPromise();

        if (response.success) {
            return response.users;
        }

        return [];
    }
}
