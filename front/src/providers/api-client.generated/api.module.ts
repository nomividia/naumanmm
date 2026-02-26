import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { ActivityLogsService } from './api/activityLogs.service';
import { AnonymousExchangesService } from './api/anonymousExchanges.service';
import { ApiSocketService } from './api/apiSocket.service';
import { AppRightsService } from './api/appRights.service';
import { AuthService } from './api/auth.service';
import { CandidateApplicationsService } from './api/candidateApplications.service';
import { CandidateJobOfferHistoryService } from './api/candidateJobOfferHistory.service';
import { CandidateMessagesService } from './api/candidateMessages.service';
import { CandidatePresentationsService } from './api/candidatePresentations.service';
import { CandidateResumesService } from './api/candidateResumes.service';
import { CandidatesService } from './api/candidates.service';
import { CustomersService } from './api/customers.service';
import { DefaultService } from './api/default.service';
import { FileService } from './api/file.service';
import { GdriveService } from './api/gdrive.service';
import { HistoryService } from './api/history.service';
import { ImageService } from './api/image.service';
import { InterviewsService } from './api/interviews.service';
import { JobOffersService } from './api/jobOffers.service';
import { JobReferencesService } from './api/jobReferences.service';
import { JobsService } from './api/jobs.service';
import { KeyValueService } from './api/keyValue.service';
import { MailService } from './api/mail.service';
import { NewsletterService } from './api/newsletter.service';
import { NewsletterTemplatesService } from './api/newsletterTemplates.service';
import { NotificationsService } from './api/notifications.service';
import { PdfService } from './api/pdf.service';
import { ReferentialService } from './api/referential.service';
import { TranslateService } from './api/translate.service';
import { UsersService } from './api/users.service';
import { UsersRolesService } from './api/usersRoles.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
