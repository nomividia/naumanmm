import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthDataService } from '../../services/auth-data.service';
import { GlobalAppService } from '../../services/global.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (!route.data || !route.data.roles || !AuthDataService.currentUser) {
            GlobalAppService.redirectToLoginPage(this.router);
            return false;
        }

        const roles = route.data.roles as string[];

        if (
            GlobalAppService.userHasOneOfRoles(
                AuthDataService.currentUser,
                roles,
            )
        ) {
            return true;
        }

        // GlobalAppService.redirectToLoginPage(this.router);
        this.router.navigate([GlobalAppService.getHomePageByUser()]);

        return false;
    }
}
