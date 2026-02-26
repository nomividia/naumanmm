import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { MailsTestsComponent } from './mails-tests.component';

const Routes = [
    {
        path: '',
        component: MailsTestsComponent,
    },
];

@NgModule({
    imports: [
        ...CommonModulesList,
        RouterModule.forChild(Routes),
        DrawerContainerModule,
    ],
    declarations: [MailsTestsComponent],
    providers: [],
    exports: [RouterModule],
})
export class MailsTestsModule {}
