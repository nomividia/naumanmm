import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { filter } from 'rxjs/operators';
import { ImagesHelper } from '../../../shared/images.helper';
import { RolesList } from '../../../shared/shared-constants';
import { BaseComponent } from '../components/base/base.component';
import { TOSDialog } from '../components/tos-dialog/tos-dialog.component';
import { OfflineMessage } from '../environments/constants';
import { environment } from '../environments/environment';
import { BasePageComponent } from '../pages/base/base-page.component';
import { CandidateApplicationsService, CandidateMessagesService, JobOffersService, UsersService } from '../providers/api-client.generated';
import { AuthProvider } from '../providers/auth-provider';
import { LanguageProvider } from '../providers/language.provider';
import { ServerResponseService } from '../providers/server-response.service';
import { UpdateService } from '../providers/sw-update.service';
import { ApiClientHelpers } from '../services/api-client.helpers';
import { AuthDataService } from '../services/auth-data.service';
import { ErrorManager } from '../services/error-manager';
import { EventsHandler } from '../services/events.handler';
import { GlobalAppService } from '../services/global.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  <div class="mainLoadingOverlay" style="display:none">
      <div style="position: relative;margin-top:40vh">
          <mat-spinner diameter="80" strokeWidth="7"></mat-spinner>
      </div>
      <div class="mainLoadingOverlayMessage"></div>
  </div>
`,
  styles: [`
  app-root
  {
      width:100%;
      height:100%;
      display:block;
  }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent extends BaseComponent {
  ioConnection: any;

  constructor(
    private authProvider: AuthProvider,
    private router: Router,
    private languageProvider: LanguageProvider,
    meta: Meta,
    title: Title,
    serverResponseService: ServerResponseService,
    private updateService: UpdateService,
    @Inject(PLATFORM_ID) private platformId: any,
    private dialogService: DialogService,
    private candidateApplicationService: CandidateApplicationsService,
    private candidateMessageService: CandidateMessagesService,
    private usersService: UsersService,
    private translateService: TranslateService,
    private jobOffersService: JobOffersService,

  ) {
    super();
    ApiClientHelpers.init(jobOffersService, candidateApplicationService, this.translateService);
    ErrorManager.init(dialogService);
    ImagesHelper.init('', environment.apiBaseUrl);
    BasePageComponent.meta = meta;
    BasePageComponent.title = title;
    BasePageComponent.serverResponseService = serverResponseService;
    title.setTitle('Morgan And Mallet CRM' + (environment.envName !== 'production' ? (' [' + environment.envName + ']') : '') + ' - v' + this.environment.version);
      this.languageProvider.init();

    if (isPlatformBrowser(this.platformId)) {
      // LanguageProvider.setLanguageFromUrl(false);
      this.initCheckTos();
      this.initForBrowser();
    }
  }

    private subcribeToRouterEvents(): void {
        const routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof NavigationStart)).subscribe((event) => {
          if (event instanceof NavigationEnd) {
            GlobalAppService.HideMainLoadingOverlay();
        } else if (event instanceof NavigationStart) {
            GlobalAppService.ShowMainLoadingOverlay();

          if (typeof document !== 'undefined') {
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            document.body.scrollTop = 0; // For Safari
          }
        }
      });
    this.eventsCollector.collect(routerSub);
  }

  private async initForBrowser() {
    await this.authProvider.initAuthProvider();
    SocketService.initSocket();
    this.subcribeToRouterEvents();

    const sub = AuthDataService.currentUserChanged.subscribe(() => {
      if (!AuthDataService.currentUser) {
        this.router.navigate(['/login']);
      }
    });
    this.eventsCollector.collect(sub);
    this.updateService.init();
    EventsHandler.init();
    const sub2 = EventsHandler.ConnectivityChanged.subscribe((online) => {
      if (!online)
        this.dialogService.showSnackBar(OfflineMessage);
      else
        this.dialogService.showSnackBar('Connexion restaurée', null, { duration: 3000 });

    });
    this.eventsCollector.collect(sub2);
    GlobalAppService.init(this.eventsCollector, this.candidateApplicationService, this.candidateMessageService);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    EventsHandler.destroy();
  }

  private initCheckTos() {
    this.subscribeToEvent(EventsHandler.AuthServiceInitialized, () => {
      this.checkTOS();
    });
    this.subscribeToEvent(EventsHandler.UserLogged, () => {
      this.checkTOS();
      if (AuthDataService.currentUser) {
        GlobalAppService.loadUnseenCandidateApplication(this.candidateApplicationService, true);
      }
    });
  }
  private async checkTOS() {
    if (!this.AuthDataService.currentUser || !GlobalAppService.userHasRole(this.AuthDataService.currentUser, RolesList.Candidate))
      return;
    // console.log("Log ~ file: app.component.ts ~ line 124 ~ AppComponent ~ checkTOS ~ checkTOS");
    const getUserAcceptedTOSResponse = await this.usersService.hasUserAcceptedTOS().toPromise();
    // console.log("Log ~ file: home.component.ts ~ line 36 ~ HomeComponent ~ checkTOS ~ getUserAcceptedTOSResponse", getUserAcceptedTOSResponse);
    if (!getUserAcceptedTOSResponse.success)
      return this.dialogService.showDialog(getUserAcceptedTOSResponse.message);
    const hasUserAcceptedTOS = getUserAcceptedTOSResponse.hasAcceptedTOS;
    if (!hasUserAcceptedTOS) {
      await this.dialogService.showCustomDialogAwaitable({ component: TOSDialog, maxWidth: "80%", minHeight: "80vh", exitOnClickOutside: false });
      // this.loading = true;
      const saveUserResponse = await this.usersService.acceptTOS().toPromise();
      // this.loading = false;
      if (!saveUserResponse.success) {
        this.dialogService.showDialog(saveUserResponse.message);
        return;
      }
      else {
        const msg = await this.translateService.get('TOS.TOSAccepted').toPromise();
        this.dialogService.showSnackBar(msg);
      }
    }
  }


}
