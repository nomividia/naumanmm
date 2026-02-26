import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../../app/app.module';
import { CandidateFilesModule } from '../../../components/candidate-files/candidate-files.module';
import { CandidateInformationsModule } from '../../../components/candidate-informations/candidate-informations.module';
import { DrawerContainerModule } from '../../../components/drawer-container/drawer-container.module';
import { ExperiencesModule } from '../../../components/experiences-component/experiences.module';
import { MyDossierComponent } from './my-dossier.component';

const Routes = [
    {
        path: '',
        component: MyDossierComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        CandidateInformationsModule,
        MatTabsModule,
        MatSlideToggleModule,
        CandidateFilesModule,
        ExperiencesModule,
    ],
    declarations: [MyDossierComponent],
    exports: [RouterModule],
})
export class MyDossierModule {}
