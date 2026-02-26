import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthDataService } from '../../services/auth-data.service';
import { GlobalAppService } from '../../services/global.service';

@Injectable()
export class RightGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (!route.data || !route.data.rights || !AuthDataService.currentUser) {
            GlobalAppService.redirectToLoginPage(this.router);
            return false;
        }

        const rights = route.data.rights as string[];

        if (
            GlobalAppService.userHasOneOfRights(
                AuthDataService.currentUser,
                rights,
            )
        ) {
            return true;
        }
        // GlobalAppService.redirectToLoginPage(this.router);
        this.router.navigate(['/']);

        return false;
    }
}
