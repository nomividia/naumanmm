import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RoutesList } from '../../../../shared/routes';
import { RolesList } from '../../../../shared/shared-constants';
import { AuthDataService } from '../../services/auth-data.service';
import { GlobalAppService } from '../../services/global.service';

@Injectable()
export class AppHomeGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        if (AuthDataService.currentUser) {
            if (
                AuthDataService.currentUser &&
                GlobalAppService.userHasOneOfRoles(
                    AuthDataService.currentUser,
                    [
                        RolesList.Admin,
                        RolesList.RH,
                        RolesList.AdminTech,
                        RolesList.Consultant,
                    ],
                )
            ) {
                //Redirect ?
            }

            if (
                AuthDataService.currentUser &&
                GlobalAppService.userHasOneOfRoles(
                    AuthDataService.currentUser,
                    [RolesList.Candidate],
                )
            ) {
                this.router.navigate(['/' + RoutesList.Candidate_MyDashBoard]);
                return false;
            }

            return true;
        }

        this.router.navigate(['/' + RoutesList.Login]);

        return false;
    }
}
